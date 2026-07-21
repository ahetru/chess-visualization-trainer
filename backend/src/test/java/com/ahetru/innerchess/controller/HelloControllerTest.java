package com.ahetru.innerchess.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class HelloControllerTest {

	@Test
	void apiHelloReturnsBackendStatusMessage() {
		HelloController controller = new HelloController();

		assertEquals("InnerChess backend is running", controller.hello());
	}
}
