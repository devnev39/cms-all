package com.cms.cms;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import freemarker.template.Configuration;

@SpringBootApplication
public class CmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CmsApplication.class, args);
	}

	@Bean
	public ModelMapper getModelMapper() {
		ModelMapper mm = new ModelMapper();
		return mm;
	}

	@Bean
	public Configuration getConfiguration() throws IOException {
		Configuration configuration = new Configuration(Configuration.VERSION_2_3_31);
		// configuration.setClassForTemplateLoading(this.getClass(), "/templates");
		configuration.setDirectoryForTemplateLoading(new File(Paths.get(System.getProperty("user.dir"), "templates").toString()));
		configuration.setDefaultEncoding("UTF-8");
		return configuration;
	}

}
