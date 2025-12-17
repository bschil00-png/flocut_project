package com.flocut.demo.global.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GraphiQLController {
//GraphiQL 웹 UI를 브라우저에서 열 수 있게 해주는 “개발 편의용 Controller”
    @GetMapping("/graphiql")
    public String graphiql() {
        return "forward:/graphiql/index.html";
    }
}