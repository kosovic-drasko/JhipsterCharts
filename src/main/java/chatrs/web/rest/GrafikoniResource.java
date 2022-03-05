package chatrs.web.rest;

import chatrs.domain.Grafikoni;
import chatrs.repository.GrafikoniRepository;
import chatrs.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link chatrs.domain.Grafikoni}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GrafikoniResource {

    private final Logger log = LoggerFactory.getLogger(GrafikoniResource.class);

    private static final String ENTITY_NAME = "grafikoni";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrafikoniRepository grafikoniRepository;

    public GrafikoniResource(GrafikoniRepository grafikoniRepository) {
        this.grafikoniRepository = grafikoniRepository;
    }

    /**
     * {@code POST  /grafikonis} : Create a new grafikoni.
     *
     * @param grafikoni the grafikoni to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grafikoni, or with status {@code 400 (Bad Request)} if the grafikoni has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grafikonis")
    public ResponseEntity<Grafikoni> createGrafikoni(@RequestBody Grafikoni grafikoni) throws URISyntaxException {
        log.debug("REST request to save Grafikoni : {}", grafikoni);
        if (grafikoni.getId() != null) {
            throw new BadRequestAlertException("A new grafikoni cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Grafikoni result = grafikoniRepository.save(grafikoni);
        return ResponseEntity
            .created(new URI("/api/grafikonis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grafikonis/:id} : Updates an existing grafikoni.
     *
     * @param id the id of the grafikoni to save.
     * @param grafikoni the grafikoni to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grafikoni,
     * or with status {@code 400 (Bad Request)} if the grafikoni is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grafikoni couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grafikonis/{id}")
    public ResponseEntity<Grafikoni> updateGrafikoni(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grafikoni grafikoni
    ) throws URISyntaxException {
        log.debug("REST request to update Grafikoni : {}, {}", id, grafikoni);
        if (grafikoni.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grafikoni.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grafikoniRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grafikoni result = grafikoniRepository.save(grafikoni);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grafikoni.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grafikonis/:id} : Partial updates given fields of an existing grafikoni, field will ignore if it is null
     *
     * @param id the id of the grafikoni to save.
     * @param grafikoni the grafikoni to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grafikoni,
     * or with status {@code 400 (Bad Request)} if the grafikoni is not valid,
     * or with status {@code 404 (Not Found)} if the grafikoni is not found,
     * or with status {@code 500 (Internal Server Error)} if the grafikoni couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grafikonis/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Grafikoni> partialUpdateGrafikoni(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grafikoni grafikoni
    ) throws URISyntaxException {
        log.debug("REST request to partial update Grafikoni partially : {}, {}", id, grafikoni);
        if (grafikoni.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grafikoni.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grafikoniRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grafikoni> result = grafikoniRepository
            .findById(grafikoni.getId())
            .map(existingGrafikoni -> {
                if (grafikoni.getRegion() != null) {
                    existingGrafikoni.setRegion(grafikoni.getRegion());
                }
                if (grafikoni.getPromet() != null) {
                    existingGrafikoni.setPromet(grafikoni.getPromet());
                }

                return existingGrafikoni;
            })
            .map(grafikoniRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grafikoni.getId().toString())
        );
    }

    /**
     * {@code GET  /grafikonis} : get all the grafikonis.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grafikonis in body.
     */
    @GetMapping("/grafikonis")
    public List<Grafikoni> getAllGrafikonis() {
        log.debug("REST request to get all Grafikonis");
        return grafikoniRepository.findAll();
    }

    /**
     * {@code GET  /grafikonis/:id} : get the "id" grafikoni.
     *
     * @param id the id of the grafikoni to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grafikoni, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grafikonis/{id}")
    public ResponseEntity<Grafikoni> getGrafikoni(@PathVariable Long id) {
        log.debug("REST request to get Grafikoni : {}", id);
        Optional<Grafikoni> grafikoni = grafikoniRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grafikoni);
    }

    /**
     * {@code DELETE  /grafikonis/:id} : delete the "id" grafikoni.
     *
     * @param id the id of the grafikoni to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grafikonis/{id}")
    public ResponseEntity<Void> deleteGrafikoni(@PathVariable Long id) {
        log.debug("REST request to delete Grafikoni : {}", id);
        grafikoniRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
