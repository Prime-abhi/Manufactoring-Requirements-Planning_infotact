package com.mrp.controller;

import com.mrp.entity.BomLink;
import com.mrp.service.BomLinkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bom-links")
@CrossOrigin(origins = "*")
public class BomLinkController {

	private final BomLinkService bomLinkService;

	public BomLinkController(BomLinkService bomLinkService) {
	    this.bomLinkService = bomLinkService;
	}

    // POST /api/bom-links
    @PostMapping
    public ResponseEntity<?> createLink(
            @RequestBody Map<String, Object> request) {
        try {
            Long parentId = Long.parseLong(
                request.get("parentItemId").toString());
            Long childId = Long.parseLong(
                request.get("childItemId").toString());
            Double quantity = Double.parseDouble(
                request.get("quantityRequired").toString());

            BomLink link = bomLinkService.createLink(
                parentId, childId, quantity);
            return ResponseEntity.ok(link);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/bom-links
    @GetMapping
    public ResponseEntity<List<BomLink>> getAllLinks() {
        return ResponseEntity.ok(
            bomLinkService.getAllLinks());
    }

    // GET /api/bom-links/children/{parentId}
    @GetMapping("/children/{parentId}")
    public ResponseEntity<?> getChildren(
            @PathVariable Long parentId) {
        return ResponseEntity.ok(
            bomLinkService.getChildren(parentId));
    }

    // GET /api/bom-links/tree/{itemId}
    @GetMapping("/tree/{itemId}")
    public ResponseEntity<?> getTree(
            @PathVariable Long itemId) {
        try {
            return ResponseEntity.ok(
                bomLinkService.getTree(itemId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/bom-links/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLink(
            @PathVariable Long id) {
        try {
            bomLinkService.deleteLink(id);
            return ResponseEntity.ok(Map.of(
                "message", "BOM link deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}