package com.flocut.demo.global.utils;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import java.io.InputStream;

public class DocxTextExtractor {

    public static String extract(InputStream inputStream) {
        try (
                XWPFDocument document = new XWPFDocument(inputStream);
                XWPFWordExtractor extractor = new XWPFWordExtractor(document)
        ) {
            return extractor.getText();

        } catch (Exception e) {
            throw new RuntimeException("DOCX 텍스트 추출 실패", e);
        }
    }
}
