package chatrs.repository;

import chatrs.domain.Grafikoni;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Grafikoni entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GrafikoniRepository extends JpaRepository<Grafikoni, Long> {}
