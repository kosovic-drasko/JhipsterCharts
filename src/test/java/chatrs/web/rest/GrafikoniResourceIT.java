package chatrs.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import chatrs.IntegrationTest;
import chatrs.domain.Grafikoni;
import chatrs.repository.GrafikoniRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GrafikoniResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrafikoniResourceIT {

    private static final String DEFAULT_REGION = "AAAAAAAAAA";
    private static final String UPDATED_REGION = "BBBBBBBBBB";

    private static final Integer DEFAULT_PROMET = 1;
    private static final Integer UPDATED_PROMET = 2;

    private static final String ENTITY_API_URL = "/api/grafikonis";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GrafikoniRepository grafikoniRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrafikoniMockMvc;

    private Grafikoni grafikoni;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grafikoni createEntity(EntityManager em) {
        Grafikoni grafikoni = new Grafikoni().region(DEFAULT_REGION).promet(DEFAULT_PROMET);
        return grafikoni;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grafikoni createUpdatedEntity(EntityManager em) {
        Grafikoni grafikoni = new Grafikoni().region(UPDATED_REGION).promet(UPDATED_PROMET);
        return grafikoni;
    }

    @BeforeEach
    public void initTest() {
        grafikoni = createEntity(em);
    }

    @Test
    @Transactional
    void createGrafikoni() throws Exception {
        int databaseSizeBeforeCreate = grafikoniRepository.findAll().size();
        // Create the Grafikoni
        restGrafikoniMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grafikoni)))
            .andExpect(status().isCreated());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeCreate + 1);
        Grafikoni testGrafikoni = grafikoniList.get(grafikoniList.size() - 1);
        assertThat(testGrafikoni.getRegion()).isEqualTo(DEFAULT_REGION);
        assertThat(testGrafikoni.getPromet()).isEqualTo(DEFAULT_PROMET);
    }

    @Test
    @Transactional
    void createGrafikoniWithExistingId() throws Exception {
        // Create the Grafikoni with an existing ID
        grafikoni.setId(1L);

        int databaseSizeBeforeCreate = grafikoniRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrafikoniMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grafikoni)))
            .andExpect(status().isBadRequest());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGrafikonis() throws Exception {
        // Initialize the database
        grafikoniRepository.saveAndFlush(grafikoni);

        // Get all the grafikoniList
        restGrafikoniMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grafikoni.getId().intValue())))
            .andExpect(jsonPath("$.[*].region").value(hasItem(DEFAULT_REGION)))
            .andExpect(jsonPath("$.[*].promet").value(hasItem(DEFAULT_PROMET)));
    }

    @Test
    @Transactional
    void getGrafikoni() throws Exception {
        // Initialize the database
        grafikoniRepository.saveAndFlush(grafikoni);

        // Get the grafikoni
        restGrafikoniMockMvc
            .perform(get(ENTITY_API_URL_ID, grafikoni.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grafikoni.getId().intValue()))
            .andExpect(jsonPath("$.region").value(DEFAULT_REGION))
            .andExpect(jsonPath("$.promet").value(DEFAULT_PROMET));
    }

    @Test
    @Transactional
    void getNonExistingGrafikoni() throws Exception {
        // Get the grafikoni
        restGrafikoniMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGrafikoni() throws Exception {
        // Initialize the database
        grafikoniRepository.saveAndFlush(grafikoni);

        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();

        // Update the grafikoni
        Grafikoni updatedGrafikoni = grafikoniRepository.findById(grafikoni.getId()).get();
        // Disconnect from session so that the updates on updatedGrafikoni are not directly saved in db
        em.detach(updatedGrafikoni);
        updatedGrafikoni.region(UPDATED_REGION).promet(UPDATED_PROMET);

        restGrafikoniMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrafikoni.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrafikoni))
            )
            .andExpect(status().isOk());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
        Grafikoni testGrafikoni = grafikoniList.get(grafikoniList.size() - 1);
        assertThat(testGrafikoni.getRegion()).isEqualTo(UPDATED_REGION);
        assertThat(testGrafikoni.getPromet()).isEqualTo(UPDATED_PROMET);
    }

    @Test
    @Transactional
    void putNonExistingGrafikoni() throws Exception {
        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();
        grafikoni.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrafikoniMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grafikoni.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grafikoni))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrafikoni() throws Exception {
        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();
        grafikoni.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrafikoniMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grafikoni))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrafikoni() throws Exception {
        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();
        grafikoni.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrafikoniMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grafikoni)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrafikoniWithPatch() throws Exception {
        // Initialize the database
        grafikoniRepository.saveAndFlush(grafikoni);

        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();

        // Update the grafikoni using partial update
        Grafikoni partialUpdatedGrafikoni = new Grafikoni();
        partialUpdatedGrafikoni.setId(grafikoni.getId());

        partialUpdatedGrafikoni.promet(UPDATED_PROMET);

        restGrafikoniMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrafikoni.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrafikoni))
            )
            .andExpect(status().isOk());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
        Grafikoni testGrafikoni = grafikoniList.get(grafikoniList.size() - 1);
        assertThat(testGrafikoni.getRegion()).isEqualTo(DEFAULT_REGION);
        assertThat(testGrafikoni.getPromet()).isEqualTo(UPDATED_PROMET);
    }

    @Test
    @Transactional
    void fullUpdateGrafikoniWithPatch() throws Exception {
        // Initialize the database
        grafikoniRepository.saveAndFlush(grafikoni);

        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();

        // Update the grafikoni using partial update
        Grafikoni partialUpdatedGrafikoni = new Grafikoni();
        partialUpdatedGrafikoni.setId(grafikoni.getId());

        partialUpdatedGrafikoni.region(UPDATED_REGION).promet(UPDATED_PROMET);

        restGrafikoniMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrafikoni.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrafikoni))
            )
            .andExpect(status().isOk());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
        Grafikoni testGrafikoni = grafikoniList.get(grafikoniList.size() - 1);
        assertThat(testGrafikoni.getRegion()).isEqualTo(UPDATED_REGION);
        assertThat(testGrafikoni.getPromet()).isEqualTo(UPDATED_PROMET);
    }

    @Test
    @Transactional
    void patchNonExistingGrafikoni() throws Exception {
        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();
        grafikoni.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrafikoniMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grafikoni.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grafikoni))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrafikoni() throws Exception {
        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();
        grafikoni.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrafikoniMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grafikoni))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrafikoni() throws Exception {
        int databaseSizeBeforeUpdate = grafikoniRepository.findAll().size();
        grafikoni.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrafikoniMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grafikoni))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grafikoni in the database
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrafikoni() throws Exception {
        // Initialize the database
        grafikoniRepository.saveAndFlush(grafikoni);

        int databaseSizeBeforeDelete = grafikoniRepository.findAll().size();

        // Delete the grafikoni
        restGrafikoniMockMvc
            .perform(delete(ENTITY_API_URL_ID, grafikoni.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grafikoni> grafikoniList = grafikoniRepository.findAll();
        assertThat(grafikoniList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
