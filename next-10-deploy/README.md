# Deploy na Vercel

Neste tutorial, vamos disponibilizar uma aplicação em Next.js para ser acessada na nuvem. Para isso, vamos utilizar a Vercel como plataforma de nuvem.

Neste tutorial, vamos utilizar a aplicação de autenticação desenvolvida no tutorial anterior. Se não tiver esta aplicação em sua máquina, consulte [Autenticação e Autorização](/next-09-auth). Esta é a aplicação que disponibilizaremos na nuvem.

Antes de fazer o deploy da nossa aplicação, precisamos resolver todos os erros de compilação existentes. Execute o comando `npm run build` e resolva todos os erros primeiramente. Quando este comando for executado sem erros, teremos finalmente a nossa aplicação pronta para ser disponibilizada em algum servidor.

### Criando a conta na Vercel

Para este tutorial, será necessário criar uma conta na Vercel vinculada à sua conta no GitHub. Para isso, faça:
1. Acesse em seu browser: https://vercel.com
2. No canto superior direito, clique em `Sign Up`
3. Clique em `I'm working on personal projects`
4. Digite o seu primeiro nome e clique em `Continue`
5. Escolha a opção que permite logar com a sua conta do GitHub e autorize a Vercel

### Deploy na Vercel

Para subir uma aplicação de exemplo do GitHub para a Vercel:

1. Deixe o repositório da aplicação de exemplo no GitHub como público e, logado na Vercel e em sua tela inicial, digite a URL do seu projeto no campo `Enter a Git repository URL to deploy` e clique no botão `<Continue>`. Para nosso projeto de exemplo, deve ficar algo como `https://github.com/SEU-USUARIO-NO-GITHUB/next-autenticacao`. Caso não esteja visualizando este campo, acesse a página em que o mesmo é apresentado: https://vercel.com/new
2. Na tela que abrir, no campo `Git Scope`, selecione `+ Add GitHub Account` e libere a instalação e acesso da Vercel ao seu GitHub para, em seguida, escolher o seu GitHub no combo. Você pode liberar acesso apenas ao repositório que estamos trabalhando. Para o nome do repositório privado a ser criado eu optei por manter o mesmo nome, seguido do texto `-privado`:`next-autorizacao-privado`. Assim que você comandar a criação, o processo de build e deploy será iniciado.
3. Você receberá uma mensagem indicando sucesso e com a tela inicial do seu projeto sendo apresentada. Clique nela e veja a URL que a Vercel disponibilizou para o seu projeto. Neste momento, note que a aplicação ainda não está funcionando e uma mensagem que indica que existe um problema na configuração do servidor pode ter sido apresentada. Lembre-se que precisamos criar as nossas variáveis de ambiente.
4. Clique no botão `Continue to Dashboard` e, no menu que é apresentado na parte superior, clique em 'Settings' -> 'Environment Variables' e adicione as variáveis de ambiente. Você não precisa digitar a variável `NEXTAUTH_URL` quando estiver fazendo deploy para a Vercel, porém as outras variáveis de ambiente devem ser criadas. Adicione cada variável e não se esqueça de clicar no botão `<Save>`. Após adicionar todas as variáveis, CUIDADO: será apresentada uma mensagem indicando a necessidade de redeploy e, enquanto você não clicar nesta mensagem, suas variáveis de ambiente não existirão no servidor remoto, logo a sua aplicação não funcionará.
5. Ainda nas configurações, altere as configurações de proteção, selecionando "Deployment Protection", desabilitando "Password Protection" e salvando.
6. No menu superior, clique em `Deployments` e clique no número do deploy marcado como "current".
7. Na tela que abrir, clique na imagem da tela inicial da sua aplicação e veja o endereço da mesma.
8. Pronto! A sua aplicação já pode ser utilizada e, a cada novo commit na branch `main` do repositório, um novo deploy será automaticamente realizado pela Vercel.
