import { Redirect } from 'expo-router';

// O app abre sempre no Início; o login fica dentro da aba Propriedade.
export default function Index() {
  return <Redirect href="/inicio" />;
}
