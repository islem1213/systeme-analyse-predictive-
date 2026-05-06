package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/ai")
public class FileController {

    @Autowired
    private AiService aiService;

    @PostMapping("/edit")
    public String editFile(@RequestParam String path) throws Exception {

        // Read file
        String code = Files.readString(Path.of(path));

        // Send to AI
        String updatedCode = aiService.improveCode(code);

        // Save file
        Files.writeString(Path.of(path), updatedCode);

        return "✅ File updated!";
    }
}
