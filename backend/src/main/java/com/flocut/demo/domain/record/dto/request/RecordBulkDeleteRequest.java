package com.flocut.demo.domain.record.dto.request;

import lombok.Getter;
import java.util.List;

@Getter
public class RecordBulkDeleteRequest {
    private List<Long> recordIds;
}
