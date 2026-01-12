// import { MY_FILES_QUERY } from "@/lib/graphql/document/document.query";
// import { FileItem } from "@/lib/graphql/document/document.type";
// import {useQuery} from "@apollo/client/react";
//
// interface MyFilesQueryResult {
//   myFiles: FileItem[];
// }
//
// export function useMyFiles() {
//   const { data, loading, error, refetch } =
//     useQuery<MyFilesQueryResult>(MY_FILES_QUERY);
//
//   return {
//     files: data?.myFiles ?? [],
//     loading,
//     error,
//     refetch,
//   };
// }
