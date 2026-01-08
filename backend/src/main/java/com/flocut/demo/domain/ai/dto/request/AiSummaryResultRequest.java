package com.flocut.demo.domain.ai.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiSummaryResultRequest {



    @JsonProperty("file_id")
    private Long fileId;

    @JsonProperty("session_id")
    private Long sessionId;

//    @JsonProperty("round_no")
//    private Integer roundNo;

    @JsonProperty("version_no")
    private Integer versionNo;

    @JsonProperty("summary")
    private String summaryText;

    @JsonProperty("model_version")
    private String modelVersion;
}
