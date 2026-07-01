package com.ahetru.innerchess;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class InnerchessApplication {

	public static void main(String[] args) {
		SpringApplication.run(InnerchessApplication.class, args);
	}

}
