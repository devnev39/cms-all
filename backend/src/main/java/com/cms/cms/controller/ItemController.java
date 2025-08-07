package com.cms.cms.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.cms.exception.InvalidInputException;
import com.cms.cms.models.common.OperationResponse;
import com.cms.cms.models.common.Roles;
import com.cms.cms.models.dto.Item.ItemDTO;
import com.cms.cms.models.dto.Item.NewItemDTO;
import com.cms.cms.models.entity.Caterer;
import com.cms.cms.models.entity.Item;
import com.cms.cms.service.CatererService;
import com.cms.cms.service.ItemService;
import com.cms.cms.utils.CurrentUser;

import jakarta.validation.Valid;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@RestController
@RequestMapping("/item")
@CrossOrigin(origins = {"*"})
public class ItemController {

    // private final String uploadDir = Paths.get(System.getProperty("user.home"), "cms", "uploads", "items").toString();

    @Autowired
    private S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;
    
    @Autowired
    private ItemService itemService;

    @Autowired
    private CatererService catererService;

    @GetMapping("")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/caterer/{catererId}")
    public List<Item> getItemsByCatererId(@PathVariable Long catererId) {
        return itemService.getItemsByCatererId(catererId);
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        Item  item =itemService.getItemById(id);
        
        return item;
    }

    @PostMapping("")
    public Item createItem(@Valid @ModelAttribute NewItemDTO item,BindingResult result) throws IOException {

        if (result.hasErrors()) {
            throw new InvalidInputException("Item", result);
        }

        // Saving file locally using uploadDir
        // Path uploadPath = Paths.get(uploadDir);

        // if (!Files.exists(uploadPath)) {
        //     Files.createDirectories(uploadPath);
        // }

        // MultipartFile image = item.getFile();
        // Path filepath = uploadPath.resolve(image.getOriginalFilename());
        // Files.createDirectories(filepath.getParent());
        // Files.createFile(filepath);
        // image.transferTo(filepath.toFile());

        // Saving file in s3

        if (item.getFile() != null) {
            String key = "uploads/items/" + UUID.randomUUID().toString() + "-" + item.getFile().getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(item.getFile().getContentType())
                    .build();
            
            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(item.getFile().getInputStream(), item.getFile().getSize()));

            String publicUrl = "https://" + bucketName + ".s3." + "ap-south-1" + ".amazonaws.com/" + key;

            item.setImagePath(key);
            item.setImageUri(publicUrl);
        }
        return itemService.createItem(item);
    }

    @PatchMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @ModelAttribute ItemDTO dto) {
        if (dto.getFile().isPresent()) {
            // Delete the existing file from S3 if it exists
            Item existingItem = itemService.getItemById(id);
            if (existingItem.getImagePath() != null) {
                DeleteObjectRequest request = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(existingItem.getImagePath())
                        .build();
                s3Client.deleteObject(request);
            }
            // Upload the new file to S3
            String key = "uploads/items/" + UUID.randomUUID().toString() + "-" + dto.getFile().get().getOriginalFilename();
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(dto.getFile().get().getContentType())
                    .build();
            try {
                s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(dto.getFile().get().getInputStream(), dto.getFile().get().getSize()));
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file to S3", e);               
            }
            String publicUrl = "https://" + bucketName + ".s3." + "ap-south-1" + ".amazonaws.com/" + key;
            dto.setImagePath(Optional.of(key));
            dto.setImageUri(Optional.of(publicUrl));
        }
        return  itemService.updateItem(id, dto);
    }

    @DeleteMapping("/{id}")
    public OperationResponse deleteItem(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
    	OperationResponse resp = itemService.deleteItem(id);
        // Delete the file from S3

        if (item.getImagePath() != null) {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(item.getImagePath())
                    .build();
            
            s3Client.deleteObject(request);
        }
        return resp;
    }
}
