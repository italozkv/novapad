# Discord Rich Presence

Este plugin mostra o NovaPad no Discord Rich Presence automaticamente.

O que ele faz:
- Exibe `NovaPad` como atividade
- Mostra o tempo decorrido desde que o app abriu
- Usa o status `Escrevendo notas`
- Pode exibir, opcionalmente, a nota atual e o workspace atual
- Nunca expõe o conteúdo da nota

Como funciona:
- O plugin usa o `discord-rpc`
- O app principal inicializa o plugin ao abrir o NovaPad
- O renderer manda apenas metadados seguros, como título da nota e workspace
- Se o Discord não estiver aberto, o plugin falha silenciosamente e tenta reconectar

Você não precisa configurar nada no Discord Developer Portal:
- O Client ID oficial já está embutido no NovaPad
- O plugin se conecta automaticamente ao Discord Desktop

Ativar ou desativar:
- Abra `Ajustes > Plugins`
- Marque ou desmarque a presença do Discord
- As opções de nota atual e workspace atual ficam desligadas por padrão

Como testar:
1. Instale a dependência com `npm install`
2. Abra o NovaPad com o Discord Desktop rodando
3. Verifique sua atividade no perfil do Discord
4. Alterne as opções nos ajustes e observe a atualização

Dependência:
- `npm install discord-rpc`
