import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($name: String, $bio: String, $location: String, $website: String, $dob: String) {
    updateUser(name: $name, bio: $bio, location: $location, website: $website, dob: $dob) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
