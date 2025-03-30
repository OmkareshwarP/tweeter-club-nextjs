import { gql } from '@apollo/client';

export const GET_RECOMMENDED_USERS = gql`
  query GetRecommendedUsers($sectionId: String!, $pageSize: Int) {
    getRecommendedUsers(sectionId: $sectionId, pageSize: $pageSize) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        sectionId
        sectionTitle
        users {
          userId
          username
          name
          profilePictureMediaId
        }
      }
    }
  }
`;
