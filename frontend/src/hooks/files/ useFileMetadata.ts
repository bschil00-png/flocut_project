
import { gql } from "@apollo/client";
import {useQuery} from "@apollo/client/react";

const GET_FILE_METADATA = gql`
    query GetFileMetadata($fileId: Int!) {
        file(fileId: $fileId) {
            fileId
            fileName
            fileType
            fileSize
            regdate
        }
    }
`;

type FileMetadata = {
    fileId: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    regdate: string;
};
//  나중에 백에서 api 만들어주면 이거 사용해서 파일 다운로드 수정하기(문서쪽)
export function useFileMetadata(fileId?: number) {
    const { data, loading, error } = useQuery<{ file: FileMetadata }>(
        GET_FILE_METADATA,
        {
            variables: { fileId },
            skip: !fileId,
            fetchPolicy: "cache-first",
        }
    );

    return {
        metadata: data?.file || null,
        loading,
        error: error?.message || null,
    };
}