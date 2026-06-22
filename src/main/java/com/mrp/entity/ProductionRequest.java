package com.mrp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "production_requests")
public class ProductionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }

    public ProductionRequest() {}

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public Long getItemId()                    { return itemId; }
    public void setItemId(Long itemId)         { this.itemId = itemId; }

    public Integer getQuantity()               { return quantity; }
    public void setQuantity(Integer quantity)  { this.quantity = quantity; }

    public LocalDate getRequestDate()          { return requestDate; }
    public void setRequestDate(LocalDate d)    { this.requestDate = d; }

    public Status getStatus()                  { return status; }
    public void setStatus(Status status)       { this.status = status; }
}
