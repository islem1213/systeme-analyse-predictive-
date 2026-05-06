package com.example.demo.controller;

import com.example.demo.entity.Administrateur;
import com.example.demo.entity.Banquier;
import com.example.demo.entity.Client;
import com.example.demo.entity.Utilisateur;
import com.example.demo.model.*;
import com.example.demo.repository.UtilisateurRepository;
import com.example.demo.security.JwtUtils;
import com.example.demo.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UtilisateurRepository utilisateurRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Validate Role Selection
        String requestedRole = loginRequest.getRole();
        boolean hasCorrectRole = false;
        
        if ("Client".equalsIgnoreCase(requestedRole) && roles.contains("ROLE_CLIENT")) {
            hasCorrectRole = true;
        } else if ("Banker".equalsIgnoreCase(requestedRole) && (roles.contains("ROLE_BANQUIER") || roles.contains("ROLE_ADMIN"))) {
            hasCorrectRole = true;
        }

        if (!hasCorrectRole) {
            return ResponseEntity.status(403).body(new MessageResponse("Accès refusé : Votre profil ne correspond pas au rôle " + requestedRole));
        }

        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getNom(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (utilisateurRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        String strRole = signUpRequest.getRole();
        Utilisateur user;

        if (strRole == null) {
            strRole = "ROLE_CLIENT";
        }

        switch (strRole) {
            case "ROLE_ADMIN":
                user = new Administrateur();
                break;
            case "ROLE_BANQUIER":
                user = new Banquier();
                break;
            default:
                Client client = new Client();
                client.setRevenuMensuel(signUpRequest.getRevenuMensuel());
                client.setChargesFixes(signUpRequest.getChargesFixes());
                client.setProfession(signUpRequest.getProfession());
                client.setSituationFamiliale(signUpRequest.getSituationFamiliale());
                user = client;
                strRole = "ROLE_CLIENT";
        }

        user.setNom(signUpRequest.getNom());
        user.setEmail(signUpRequest.getEmail());
        user.setMotDePasse(encoder.encode(signUpRequest.getPassword()));
        user.setRole(strRole);

        utilisateurRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
