import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $userId: String!
    $name: String!
    $profilePictureMediaId: String
    $headerPictureMediaId: String
    $bio: String
    $dob: String
    $location: String
    $website: String
    $socialLinks: [String!]
  ) {
    updateUser(
      userId: $userId
      name: $name
      profilePictureMediaId: $profilePictureMediaId
      headerPictureMediaId: $headerPictureMediaId
      bio: $bio
      dob: $dob
      location: $location
      website: $website
      socialLinks: $socialLinks
    ) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
