import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $provider: String!
    $verificationStatus: String!
    $firstname: String!
    $lastname: String!
    $gender: String
    $profilePictureMediaId: String
    $signUpIpv4Address: String
  ) {
    createUser(
      email: $email
      provider: $provider
      verificationStatus: $verificationStatus
      firstname: $firstname
      lastname: $lastname
      gender: $gender
      profilePictureMediaId: $profilePictureMediaId
      signUpIpv4Address: $signUpIpv4Address
    ) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
