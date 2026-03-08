package com.medcurekashmir.service;

import com.medcurekashmir.model.Patient;
import com.medcurekashmir.model.Wallet;
import com.medcurekashmir.model.WalletTransaction;
import com.medcurekashmir.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    /**
     * Get or create wallet for patient
     */
    public Wallet getOrCreateWallet(Patient patient) {
        return walletRepository.findByPatient(patient)
                .orElseGet(() -> {
                    Wallet wallet = new Wallet();
                    wallet.setPatient(patient);
                    wallet.setBalance(0.0);
                    return walletRepository.save(wallet);
                });
    }

    /**
     * Get wallet by patient ID
     */
    public Optional<Wallet> getWalletByPatientId(Long patientId) {
        return walletRepository.findByPatientId(patientId);
    }

    /**
     * Add money to wallet
     */
    public WalletTransaction addMoney(Wallet wallet, Double amount, String paymentMethod, String transactionId) {
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(amount);
        transaction.setType(WalletTransaction.TransactionType.CREDIT);
        transaction.setDescription("Money added via " + paymentMethod);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setPaymentMethod(paymentMethod);
        transaction.setTransactionId(transactionId);
        transaction.setStatus("SUCCESS");

        return transaction;
    }

    /**
     * Deduct money from wallet
     */
    public WalletTransaction deductMoney(Wallet wallet, Double amount, String description) {
        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance() - amount);
        walletRepository.save(wallet);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(amount);
        transaction.setType(WalletTransaction.TransactionType.DEBIT);
        transaction.setDescription(description);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus("SUCCESS");

        return transaction;
    }

    /**
     * Check if wallet has sufficient balance
     */
    public boolean hasSufficientBalance(Wallet wallet, Double amount) {
        return wallet != null && wallet.getBalance() >= amount;
    }
}
