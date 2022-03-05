package chatrs.domain;

import static org.assertj.core.api.Assertions.assertThat;

import chatrs.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GrafikoniTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grafikoni.class);
        Grafikoni grafikoni1 = new Grafikoni();
        grafikoni1.setId(1L);
        Grafikoni grafikoni2 = new Grafikoni();
        grafikoni2.setId(grafikoni1.getId());
        assertThat(grafikoni1).isEqualTo(grafikoni2);
        grafikoni2.setId(2L);
        assertThat(grafikoni1).isNotEqualTo(grafikoni2);
        grafikoni1.setId(null);
        assertThat(grafikoni1).isNotEqualTo(grafikoni2);
    }
}
