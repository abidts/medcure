package com.sehat24x7.service;

import com.sehat24x7.model.InstantConsultationQueue;
import com.sehat24x7.model.InstantConsultationQueue.QueueStatus;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.repository.InstantConsultationQueueRepository;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InstantConsultationService {

    @Autowired
    private InstantConsultationQueueRepository queueRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public InstantConsultationQueue joinQueue(Long doctorId, Long patientId) {
        // Check if doctor is online
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        if (!doctor.getOnlineStatus()) {
            throw new RuntimeException("Doctor is not available for instant consultations");
        }

        // Check if patient is already in queue
        Optional<InstantConsultationQueue> existing = queueRepository.findByDoctorIdAndPatientIdAndStatus(
            doctorId, patientId, QueueStatus.WAITING);
        if (existing.isPresent()) {
            throw new RuntimeException("You are already in the queue");
        }

        // Get next queue position
        Integer maxPosition = queueRepository.findMaxQueuePosition(doctorId);
        int nextPosition = (maxPosition != null) ? maxPosition + 1 : 1;

        InstantConsultationQueue queueEntry = new InstantConsultationQueue();
        queueEntry.setDoctor(doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found")));
        queueEntry.setPatient(patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found")));
        queueEntry.setQueuePosition(nextPosition);
        queueEntry.setStatus(QueueStatus.WAITING);

        return queueRepository.save(queueEntry);
    }

    public List<InstantConsultationQueue> getWaitingQueue(Long doctorId) {
        return queueRepository.findWaitingQueue(doctorId);
    }

    public InstantConsultationQueue acceptPatient(Long queueId) {
        InstantConsultationQueue queue = queueRepository.findById(queueId)
            .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        if (queue.getStatus() != QueueStatus.WAITING) {
            throw new RuntimeException("Patient is no longer waiting");
        }

        queue.setStatus(QueueStatus.ACCEPTED);
        queue.setAcceptedAt(LocalDateTime.now());

        // Reorder remaining queue
        reorderQueue(queue.getDoctor().getId(), queue.getQueuePosition());

        return queueRepository.save(queue);
    }

    public InstantConsultationQueue startConsultation(Long queueId) {
        InstantConsultationQueue queue = queueRepository.findById(queueId)
            .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        if (queue.getStatus() != QueueStatus.ACCEPTED) {
            throw new RuntimeException("Consultation must be accepted first");
        }

        queue.setStatus(QueueStatus.IN_PROGRESS);
        queue.setStartedAt(LocalDateTime.now());

        return queueRepository.save(queue);
    }

    public InstantConsultationQueue completeConsultation(Long queueId) {
        InstantConsultationQueue queue = queueRepository.findById(queueId)
            .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        queue.setStatus(QueueStatus.COMPLETED);
        queue.setCompletedAt(LocalDateTime.now());

        return queueRepository.save(queue);
    }

    public void leaveQueue(Long doctorId, Long patientId) {
        Optional<InstantConsultationQueue> queue = queueRepository.findByDoctorIdAndPatientIdAndStatus(
            doctorId, patientId, QueueStatus.WAITING);
        
        if (queue.isPresent()) {
            InstantConsultationQueue q = queue.get();
            q.setStatus(QueueStatus.CANCELLED);
            queueRepository.save(q);
            
            // Reorder remaining queue
            reorderQueue(doctorId, q.getQueuePosition());
        }
    }

    private void reorderQueue(Long doctorId, int removedPosition) {
        List<InstantConsultationQueue> remaining = queueRepository.findByDoctorIdAndStatusOrderByQueuePosition(
            doctorId, QueueStatus.WAITING);
        
        for (InstantConsultationQueue q : remaining) {
            if (q.getQueuePosition() > removedPosition) {
                q.setQueuePosition(q.getQueuePosition() - 1);
                queueRepository.save(q);
            }
        }
    }

    public Long getQueuePosition(Long doctorId, Long patientId) {
        Optional<InstantConsultationQueue> queue = queueRepository.findByDoctorIdAndPatientIdAndStatus(
            doctorId, patientId, QueueStatus.WAITING);
        return queue.map(q -> (long)q.getQueuePosition()).orElse(null);
    }

    public Long getQueueLength(Long doctorId) {
        return queueRepository.countByDoctorIdAndStatus(doctorId, QueueStatus.WAITING);
    }
}
