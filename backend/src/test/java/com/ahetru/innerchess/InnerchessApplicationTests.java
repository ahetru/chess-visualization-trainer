package com.ahetru.innerchess;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;

@SpringBootTest(properties = {
	"spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration,org.springframework.boot.data.jpa.autoconfigure.DataJpaRepositoriesAutoConfiguration,org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration,org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration,org.springframework.boot.testcontainers.autoconfigure.TestcontainersAutoConfiguration"
})
class InnerchessApplicationTests {

	@MockitoBean
	private PuzzleRepository puzzleRepository;

	@Test
	void contextLoads() {
	}

}
