import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getToken } from './token';
import { logOutHandler } from './firebase/auth';
import toast from 'react-hot-toast';

const cache = new InMemoryCache();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      toast.error('Unauthorized - Logging out');
      logOutHandler();
    }
  }
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getToken();
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `${token}` //Authorization: `Bearer ${token}`
      }
    });
  }
  return forward(operation);
});

const getApolloClient = (endpoint: string) => {
  const httpLink = new HttpLink({
    uri: endpoint
  });

  const _link: ApolloLink = ApolloLink.from([authLink, errorLink, httpLink]);

  const client = new ApolloClient({
    link: _link,
    cache: cache
  });

  return client;
};

//service-endpoints
export const userManageClient = getApolloClient(process.env.NEXT_PUBLIC_SERVICE_USER_MANAGE_ENDPOINT!);
