package com.flocut.demo.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        StringRedisSerializer s = new StringRedisSerializer();

        // 일반 키/밸류 설정
        template.setKeySerializer(s);
        template.setValueSerializer(s);

        //  해시(Hash) 데이터 직렬화 설정
        template.setHashKeySerializer(s);
        template.setHashValueSerializer(s);

        template.afterPropertiesSet();
        return template;
    }
}