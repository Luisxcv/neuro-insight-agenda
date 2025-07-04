
package com.aineurysm.repository;

import com.aineurysm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    List<User> findByRoleAndIsApproved(String role, boolean isApproved);
    
    List<User> findByRoleAndIsApprovedAndIsActive(String role, boolean isApproved, boolean isActive);
}
