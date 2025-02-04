import { gql } from '@apollo/client';

export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($userId: String!, $username: String!) {
    updateUsername(userId: $userId, username: $username) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
