package com.cms.cms.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import org.openpdf.pdf.ITextRenderer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.CustomEntityNotFoundException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.common.UserPrincipal;
import com.cms.cms.models.dto.AuthBody;
import com.cms.cms.models.dto.AuthResponse;
import com.cms.cms.models.entity.Role;
import com.cms.cms.repository.RoleRepository;
import com.cms.cms.utils.JwtService;

import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateNotFoundException;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authManager;

    private JwtService jwtService;

    private RoleRepository repo;

    private Configuration cfg;

    @GetMapping("")
    public ResponseEntity<?> login(
            @RequestHeader(value = "Authorization", required = false) String authHeader)
            throws Exception {
        if (authHeader == null || !authHeader.startsWith("Basic")) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("WWW-Authenticate", "Basic realm=\"Access to the auth\"");
            return new ResponseEntity<>("Auth required !", headers, HttpStatus.UNAUTHORIZED);
        }
        String base64Credentials = authHeader.substring("Basic ".length());
        byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(credDecoded, StandardCharsets.UTF_8);

        // Split username and password
        final String[] values = credentials.split(":", 2);
        if (values.length != 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid auth format");
        }

        String username = values[0];
        String password = values[1];

        System.out.println(username);
        System.out.println(password);

        return new ResponseEntity<>(login(new AuthBody(username, password)), new HttpHeaders(),
                200);
    }

    // @GetMapping("")
    // public ResponseEntity<String> login() throws Exception {
    // HttpHeaders headers = new HttpHeaders();
    // headers.add("WWW-Authenticate", "Basic");
    // return ResponseEntity.status(401).headers(headers).build();
    // }

    @PostMapping("")
    public ResponseEntity<?> login(@RequestBody AuthBody body) throws Exception {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword()));

            if (auth.isAuthenticated()) {
                UserPrincipal user = (UserPrincipal) auth.getPrincipal();
                Role role = repo.findById(user.getUser().getRoleId()).get();
                if (role == null)
                    throw new CustomEntityNotFoundException("Role");
                return new ResponseEntity<AuthResponse>(
                        new AuthResponse(jwtService.getJwtToken(user.getUser(), role),
                                user.getUser()),
                        HttpStatus.OK);
            }
        } catch (BadCredentialsException e) {
            return new ResponseEntity<OperationResponse>(
                    new OperationResponse("Invalid username or password !"),
                    HttpStatus.UNAUTHORIZED);
        }
        throw new Exception("Error occured !");
    }

    // @PostMapping("/upload-file-test")
    // public ResponseEntity<Map<String, String>> postFile(@ModelAttribute NewItemDTO item) {
    // try {
    // // Simulate file processing
    // String fileName = item.getFile().getOriginalFilename();
    // long fileSize = item.getFile().getSize();
    // String contentType = item.getFile().getContentType();

    // // Return a response with file details
    // return ResponseEntity.ok(Map.of(
    // "fileName", fileName,
    // "fileSize", String.valueOf(fileSize),
    // "contentType", contentType,
    // "name", item.getName(),
    // "price", item.getPrice().toString()
    // ));
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "File
    // upload failed"));
    // }
    // }

    @GetMapping("/test")
    public ResponseEntity<?> getMethodName() throws TemplateNotFoundException,
            MalformedTemplateNameException, ParseException, IOException, TemplateException {
        System.out.println(System.getProperty("user.dir"));
        Map<String, Object> map = Map.of("user", "Bhuvanesh");
        Template template = cfg.getTemplate("hello.ftlh");

        // ByteArrayOutputStream bos = new ByteArrayOutputStream();
        Writer out = new StringWriter();
        template.process(map, out);

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(out.toString());
        renderer.layout();
        renderer.createPDF(bos);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/pdf");
        headers.add("Content-Disposition", "attachment; filename=hello.pdf");

        return ResponseEntity.ok().headers(headers).body(bos.toByteArray());
        // return ResponseEntity.ok().build();
    }


}

// $2a$10$v1Zz1CJnRpfIMIxDem8x2.zXi0u2IBjulHmebh7LAn3fuq76Ovk9C
