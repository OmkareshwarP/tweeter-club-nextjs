import { gql } from '@apollo/client';

export const GET_USER_INFO_BY_USERNAME = gql`
  query GetUserInfoByUsername($username: String!) {
    getUserInfoByUsername(username: $username) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
        username
        name
        profilePictureMediaId
        followersCount
        followingCount
        bio
        location
        website
        dob
        socialLinks
        createdAt
      }
    }
  }
`;
