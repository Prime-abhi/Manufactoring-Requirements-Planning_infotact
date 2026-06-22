 
package com.mrp.service;

import com.mrp.entity.Product;
import com.mrp.entity.Product.ProductType;
import com.mrp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /** Return all products, optionally filtered by type. */
    public List<Product> getProducts(String type) {
        if (type != null && !type.isBlank()) {
            ProductType productType = ProductType.valueOf(type.toUpperCase());
            return productRepository.findByType(productType);
        }
        return productRepository.findAll();
    }

    /** Return a single product by id. */
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
}
