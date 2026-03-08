package com.medcurekashmir.controller;

import com.medcurekashmir.model.Patient;
import com.medcurekashmir.model.Wallet;
import com.medcurekashmir.model.WalletTransaction;
import com.medcurekashmir.repository.PatientRepository;
import com.medcurekashmir.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private PatientRepository patientRepository;

    /**
     * Get wallet details for a patient
     */
    @GetMapping("/{patientId}")
    public ResponseEntity<?> getWallet(@PathVariable Long patientId) {
        try {
            Optional<Wallet> walletOpt = walletService.getWalletByPatientId(patientId);
            if (walletOpt.isEmpty()) {
                // Create wallet if not exists
                Patient patient = patientRepository.findById(patientId)
                        .orElseThrow(() -> new RuntimeException("Patient not found"));
                walletOpt = Optional.of(walletService.getOrCreateWallet(patient));
            }

            Wallet wallet = walletOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", wallet.getId());
            response.put("balance", wallet.getBalance());
            response.put("patientId", patientId);

            // Get recent transactions
            List<Map<String, Object>> transactions = new ArrayList<>();
            if (wallet.getTransactions() != null) {
                for (WalletTransaction tx : wallet.getTransactions().stream()
                        .sorted((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()))
                        .limit(10)
                        .toList()) {
                    Map<String, Object> txMap = new HashMap<>();
                    txMap.put("id", tx.getId());
                    txMap.put("amount", tx.getAmount());
                    txMap.put("type", tx.getType().toString());
                    txMap.put("description", tx.getDescription());
                    txMap.put("date", tx.getTransactionDate());
                    txMap.put("paymentMethod", tx.getPaymentMethod());
                    txMap.put("status", tx.getStatus());
                    transactions.add(txMap);
                }
            }
            response.put("transactions", transactions);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Add money to wallet
     */
    @PostMapping("/add-money")
    public ResponseEntity<?> addMoney(
            @RequestParam Long patientId,
            @RequestParam Double amount,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String transactionId) {

        try {
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            Wallet wallet = walletService.getOrCreateWallet(patient);
            WalletTransaction transaction = walletService.addMoney(
                    wallet, amount, paymentMethod,
                    transactionId != null ? transactionId : "TXN" + System.currentTimeMillis()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Money added successfully");
            response.put("balance", wallet.getBalance());
            response.put("transaction", Map.of(
                    "id", transaction.getId(),
                    "amount", transaction.getAmount(),
                    "type", transaction.getType().toString()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Deduct money from wallet (for video calls)
     */
    @PostMapping("/deduct")
    public ResponseEntity<?> deductMoney(
            @RequestParam Long patientId,
            @RequestParam Double amount,
            @RequestParam String description) {

        try {
            Patient patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            Wallet wallet = walletService.getOrCreateWallet(patient);

            if (!walletService.hasSufficientBalance(wallet, amount)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Insufficient balance. Please add money to your wallet."
                ));
            }

            WalletTransaction transaction = walletService.deductMoney(wallet, amount, description);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment successful");
            response.put("balance", wallet.getBalance());
            response.put("transaction", Map.of(
                    "id", transaction.getId(),
                    "amount", transaction.getAmount(),
                    "type", transaction.getType().toString()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
