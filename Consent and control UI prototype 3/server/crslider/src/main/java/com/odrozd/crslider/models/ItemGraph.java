package com.user.crslider.models;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.io.Serializable;

@Data
@Entity(name = "item_graph")
@IdClass(ItemGraph.ItemGraphId.class)
public class ItemGraph {
    @Id
    @Column(name = "child_item_id")
    private Long childId;

    @Id
    @Column(name = "parent_item_id")
    private Long parentId;

    @Data
    public static class ItemGraphId implements Serializable {
        private Long childId;
        private Long parentId;

        public ItemGraphId() {
        }

        public ItemGraphId(Long childId, Long parentId) {
            this.childId = childId;
            this.parentId = parentId;
        }
    }
}
