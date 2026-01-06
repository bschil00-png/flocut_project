package com.flocut.demo.global.utils;

import org.mozilla.universalchardet.UniversalDetector;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class EncodingUtil {

    public static Charset detectCharset(byte[] bytes) {

        UniversalDetector detector = new UniversalDetector(null);
        detector.handleData(bytes, 0, bytes.length);
        detector.dataEnd();

        String encoding = detector.getDetectedCharset();
        detector.reset();

        if (encoding == null) {
            // 감지 실패 시 UTF-8 fallback
            return StandardCharsets.UTF_8;
        }

        return Charset.forName(encoding);
    }
}