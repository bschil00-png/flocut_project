import { DOCUMENT_DETAIL_QUERY } from "@/lib/graphql/document/document.query";
import { DocumentDetail } from "@/lib/graphql/document/document.type";
import {useQuery} from "@apollo/client/react";


export function useDocumentDetail(fileId: number) {
  const { data, loading } = useQuery<{
    documentDetail: DocumentDetail;
  }>(DOCUMENT_DETAIL_QUERY, {
    variables: { fileId },
    skip: !fileId,
  });

  return {
    document: data?.documentDetail ?? null,
    loading,
  };
}
