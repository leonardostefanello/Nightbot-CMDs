queue = [];
enabled = true;
open = true;
group = [];
size = 10;

for (i = 0; i < ledger.length; i++)
{
    args = ledger[i].split(",");
    
    if (args.length == 0)
        continue;
    
    switch (args[0])
    {
        case "e": /* Enable queue functions */
            enabled = true;
            break;
        case "d": /* Disable queue functions */
            enabled = false;
            break;
        case "o": /* Open queue to viewers */
            open = true;
            break;
        case "c": /* Close queue to viewers */
            open = false;
            break;
        case "s": /* Set group size to n */
            if (args.length != 2)
                continue;
            
            n = parseInt(args[1]);
            if (isNaN(n) || n <= 0)
                continue;
            
            size = n;
            break;
        case "g": /* Generate a new group from the queue */
            if (group.length + queue.length < size)
                continue;
                
            newPlayers = queue.length > size ? size : queue.length;
            reusedPlayers = size - newPlayers;
            
            group = queue.splice(0, newPlayers).concat(group.splice(0, reusedPlayers));
            break;
        case "r": /* If the user is in the queue, remove them. If the user is in the group, remove them and add another from the queue */
            if (args.length != 2)
                continue;
            
            u = args[1].toLowerCase();
            
            /* Check if the user is in the queue, and if so, remove them */
            for (j = 0; j < queue.length; j++)
            {
                if (u != queue[j].toLowerCase())
                    continue;
                
                queue.splice(j, 1);
                break;
            }
            
            /* Check if the user is in the group, and if so, replace them with the first person in the queue (if they exist) */
            for (j = 0; j < group.length; j++)
            {
                if (u != group[j].toLowerCase())
                    continue;
                
                if (queue.length == 0)
                    group.splice(j, 1);
                else
                    group.splice(j, 1, queue.splice(0, 1)[0]);
                break;
            }
            
            break;
        case "j": /* u joins the queue */
            if (args.length != 2)
                continue;
        
            queue.push(args[1]);
            break;
        case "m": /* Move u to position p */
            if (args.length != 3)
                continue;
            
            u = args[1].toLowerCase();
            p = parseInt(args[2]);
            if (isNaN(p) || p < 0 || p >= queue.length)
                continue;
            
            for (j = 0; j < queue.length; j++)
            {
                if (u != queue[j].toLowerCase())
                    continue;
                
                queue.splice(p, 0, queue.splice(j, 1)[0]);
                break;
            }
            break;
    }
}

streamerUserLevels = ["owner"];
trustedUserLevels = ["owner", "moderator", "regular"];

if (enabled || streamerUserLevels.includes(userLevel))
{
    function makeListString(array)
    {
        string = "";
        
        for (k = 0; k < array.length; k++)
        {
            string += array[k];
            if (array.length > 2 && k != array.length - 1)
                string += ", ";
            if (k == array.length - 2)
                string += " and ";
        }
        
        return string;
    }
    
    args = query.split(" ");
    if (query && args.length >= 1)
    {
        addUrl = `http://twitch.center/customapi/addquote?token=${privateToken}&data=`;
        clearUrl = `http://twitch.center/customapi/delquote?token=${privateToken}&clear=1`;
        
        switch (args[0].toLowerCase())
        {
            case "ligar":
            case "ativar":
                if (streamerUserLevels.includes(userLevel))
                {
                    if (enabled)
                        `$PRINT$ ${userName} -> As funções da fila já estão ativadas`;
                    else
                        addUrl + encodeURIComponent("e|") + "&print=" + encodeURIComponent("As funções da fila já estão ativadas!");
                }
                else
                    `$PRINT$ ${userName} -> Você deve ser o Streamer para desabilitar a fila`;
                break;
            case "desligar":
            case "desativar":
                if (streamerUserLevels.includes(userLevel))
                {
                    if (!enabled)
                        `$PRINT$ ${userName} -> As funções da fila já estão desligadas`;
                    else
                        addUrl + encodeURIComponent("d|") + "&print=" + encodeURIComponent("As funções da fila já estão desligadas!");
                }
                else
                    `$PRINT$ ${userName} -> Você deve ser o Streamer para desabilitar a fila`;
                break;
            case "iniciar":
            case "começar":
            case "abrir":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (open)
                        `$PRINT$ ${userName} -> A fila já está aberta`;
                    else
                        addUrl + encodeURIComponent("o|") + "&print=" + encodeURIComponent("A fila já está aberta!");
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para iniciar a fila`;
                break;
            case "parar":
            case "finalizar":
            case "fechar":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (!open)
                        `$PRINT$ ${userName} -> A fila já está fechada`;
                    else
                        addUrl + encodeURIComponent("c|") + "&print=" + encodeURIComponent("Agora a fila está fechada!");
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para encerrar a fila`;
                break;
            case "view":
            case "mostrar":
            case "lista":
            case "todos":
                if (trustedUserLevels.includes(userLevel))
                    `$PRINT$ Grupo Atual: ${makeListString(group)} | Fila: ${makeListString(queue)}`.substr(0, 400);
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para visualizar toda a fila`;
                break;
            case "definirtamanho":
            case "mudartamanho":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (args.length == 2)
                    {
                        newSize = parseInt(args[1]);
                        if (isNaN(newSize) || newSize <= 0)
                            `$PRINT$ ${userName} -> Insira um número inteiro positivo após "!queue ${args[0]}"`;
                        else
                            if (size == newSize)
                                `$PRINT$ ${userName} -> O tamanho do grupo de usuários já é ${size}`;
                            else
                                addUrl + encodeURIComponent(`s,${newSize}|`) + "&print=" + encodeURIComponent(`The player group size was changed from ${size} to ${newSize}!`);
                    }
                    else
                        `$PRINT$ ${userName} -> Digite um novo tamanho de grupo de usuários após "!queue ${args[0]}"`;
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para definir o tamanho do grupo de jogadores`;
                break;
            case "novo":
            case "novogrupo":
            case "criar":
            case "criargrupo":
            case "proximo":
            case "proximogrupo":
                if (trustedUserLevels.includes(userLevel))
                {
                    availablePlayers = group.length + queue.length;
                    if (availablePlayers < size)
                        `$PRINT$ ${userName} -> O número de usuários na fila e o grupo atual (${availablePlayers}) não é alto o suficiente para gerar um novo grupo de tamanho ${size}`;
                    else
                    {
                        newPlayers = queue.length > size ? size : queue.length;
                        reusedPlayers = size - newPlayers;
                        
                        group = queue.splice(0, newPlayers).concat(group.splice(0, reusedPlayers));
                        
                        (addUrl + encodeURIComponent("g|") + "&print=" + encodeURIComponent(`New group: ${makeListString(group)}`)).substr(0, 400);
                    }
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para criar um novo grupo para a fila`;
                break;
            case "limpar":
            case "reiniciar":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (ledger == "There are no quotes added")
                        `$PRINT$ ${userName} -> A fila e o grupo atual já estão vazios`;
                    else
                        clearUrl + "&print=" + encodeURIComponent("A fila e o grupo atual agora estão vazios!");
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para limpar a fila ou o grupo atual`;
                break;
            case "adicionar":
            case "adicionarmembro":
            case "adicionarusuário":
            case "adicionarseguidor":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (args.length >= 2)
                    {
                        user = query.substr(query.indexOf(" ") + 1).replace(/[|,]/g, "");
                        u = user.toLowerCase();
                        
                        currentQueuePosition = -1;
                        for (j = 0; j < queue.length; j++)
                        {
                            if (u != queue[j].toLowerCase())
                                continue;
                            
                            currentQueuePosition = j;
                            break;
                        }
                        
                        foundInGroup = false;
                        for (j = 0; j < group.length; j++)
                        {
                            if (u != group[j].toLowerCase())
                                continue;
                            
                            foundInGroup = true;
                            break;
                        }
                        
                        if (currentQueuePosition != -1)
                            `$PRINT$ ${userName} -> ${user} já está na fila na posição ${currentQueuePosition + 1}`;
                        else if (foundInGroup)
                            `$PRINT$ ${userName} -> ${user} já está no grupo atual`;
                        else
                            addUrl + encodeURIComponent(`j,${user}|`) + "&print=" + encodeURIComponent(`${user} foi adicionado na fila na posição ${queue.length + 1}`);
                    }
                    else
                        `$PRINT$ ${userName} -> Digite o usuário para adicionar após "!queue ${args[0]}"`;
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para adicionar um usuário na fila`;
                break;
            case "remover":
            case "removermembro":
            case "removerusuário":
            case "removerseguidor":
            case "deletar":
            case "deletarmembro":
            case "deletarusuário":
            case "deletarseguidor":
            case "del":
            case "delmembro":
            case "delusuário":
            case "delseguidor":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (args.length >= 2)
                    {
                        user = query.substr(query.indexOf(" ") + 1).replace(/[|,]/g, "");
                        u = user.toLowerCase();
                        
                        currentQueuePosition = -1;
                        for (j = 0; j < queue.length; j++)
                        {
                            if (u != queue[j].toLowerCase())
                                continue;
                            
                            currentQueuePosition = j;
                            break;
                        }
                        
                        foundInGroup = false;
                        for (j = 0; j < group.length; j++)
                        {
                            if (u != group[j].toLowerCase())
                                continue;
                            
                            foundInGroup = true;
                            break;
                        }
                        
                        if (currentQueuePosition != -1)
                            addUrl + encodeURIComponent(`r,${user}|`) + "&print=" + encodeURIComponent(`${user} foi removido da fila na posição ${currentQueuePosition + 1}`);
                        else if (foundInGroup)
                            addUrl + encodeURIComponent(`r,${user}|`) + "&print=" + encodeURIComponent(`${user} foi removido do grupo atual` + (queue.length == 0 ? "" : ` e foi substituido por ${queue[0]}`));
                        else
                            `$PRINT$ ${userName} -> ${user} não está na fila ou grupo atual`;
                    }
                    else
                        `$PRINT$ ${userName} -> Digite um usuário para remover após "!queue ${args[0]}"`;
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para remover um usuário da fila ou do grupo atual`;
                break;
            case "mover":
            case "movermembro":
            case "moverusuário":
            case "moverseguidor":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (queue.length == 0)
                        `$PRINT$ ${userName} -> A fila está vazia`;
                    else if (queue.length == 1)
                        `$PRINT$ ${userName} -> Como há apenas 1 usuário na fila, ele não pode ser reorganizado`;
                    else
                    {
                        match = query.match(/^[^ ]+ +([^ ].*?) +([^ ]+)$/);
                        if (match)
                        {
                            user = match[1].replace(/[|,]/g, "");
                            u = user.toLowerCase();
                            position = parseInt(match[2]);
                            
                            if (isNaN(position) || position < 1 || position > queue.length)
                                `$PRINT$ ${userName} -> A posição precisa ser entre 1 e ${queue.length}`;
                            else
                            {
                                position -= 1; /* Remove the visual offset */
                                
                                currentPosition = -1;
                                for (j = 0; j < queue.length; j++)
                                {
                                    if (u != queue[j].toLowerCase())
                                        continue;
                                    
                                    currentPosition = j;
                                    break;
                                }
                                
                                if (currentPosition == -1)
                                    `$PRINT$ ${userName} -> ${user} não está na fila`;
                                else if (position == currentPosition)
                                    `$PRINT$ ${userName} -> ${user} já está na fila na posição ${currentPosition + 1}`;
                                else
                                    addUrl + encodeURIComponent(`m,${user},${position}|`) + "&print=" + encodeURIComponent(`${user} foi movido para a posição ${currentPosition + 1} to ${position + 1}`);
                            }
                        }
                        else
                            `$PRINT$ ${userName} -> Digite um usuário para poder mover para uma nova posição "!queue ${args[0]}"`;
                    }
                }
                else
                    `$PRINT$ ${userName} -> Você precisa de permissão para poder mover um usuário na fila`;
                break;
            case "entrar":
                if (open || trustedUserLevels.includes(userLevel))
                {
                    user = userName.replace(/[|,]/g, "");
                    u = user.toLowerCase();
                        
                    currentQueuePosition = -1;
                    for (j = 0; j < queue.length; j++)
                    {
                        if (u != queue[j].toLowerCase())
                            continue;
                            
                        currentQueuePosition = j;
                        break;
                    }
                    
                    foundInGroup = false;
                    for (j = 0; j < group.length; j++)
                    {
                        if (u != group[j].toLowerCase())
                            continue;
                        
                        foundInGroup = true;
                        break;
                    }
                    
                    if (currentQueuePosition != -1)
                        `$PRINT$ ${userName} -> Você já está na fila na posição ${currentQueuePosition + 1}`;
                    else if (foundInGroup)
                        `$PRINT$ ${userName} -> Você já está no grupo atual`;
                    else
                        addUrl + encodeURIComponent(`j,${user}|`) + "&print=" + encodeURIComponent(`${userName} entrou na fila na posição ${queue.length + 1}`);
                }
                else
                    `$PRINT$ ${userName} -> A fila está fechada`;
                break;
            case "sair":
                if (open || trustedUserLevels.includes(userLevel))
                {
                    user = userName.replace(/[|,]/g, "");
                    u = user.toLowerCase();
                    
                    currentQueuePosition = -1;
                    for (j = 0; j < queue.length; j++)
                    {
                        if (u != queue[j].toLowerCase())
                            continue;
                        
                        currentQueuePosition = j;
                        break;
                    }
                    
                    foundInGroup = false;
                    for (j = 0; j < group.length; j++)
                    {
                        if (u != group[j].toLowerCase())
                            continue;
                        
                        foundInGroup = true;
                        break;
                    }
                    
                    if (currentQueuePosition != -1)
                        addUrl + encodeURIComponent(`r,${user}|`) + "&print=" + encodeURIComponent(`${userName} left the queue at position ${currentQueuePosition + 1}`);
                    else if (foundInGroup)
                        addUrl + encodeURIComponent(`r,${user}|`) + "&print=" + encodeURIComponent(`${userName} left the current group` + (queue.length == 0 ? "" : ` and was replaced by ${queue[0]}`));
                    else
                        `$PRINT$ ${userName} -> Você não está na fila ou no grupo atual`;
                }
                else
                    `$PRINT$ ${userName} -> A fila está fechada`;
                break;
            case "players":
            case "grupoatual":
            case "grupo":
                `$PRINT$ Grupo atual: ${makeListString(group)}`.substr(0, 400);
                break;
            case "tamanho":
            case "largura":
                `$PRINT$ Largura da fila: ${queue.length}`;
                break;
            case "tamanhogrupo":
            case "tamanhogrupoatual":
                `$PRINT$ Tamanho atual do grupo: ${group.length}/${size}`;
                break;
            case "posição":
            case "minhaposição":
                u = userName.toLowerCase();
                
                positionInQueue = -1;
                for (j = 0; j < queue.length; j++)
                {
                    if (u != queue[j].toLowerCase())
                        continue;
                    
                    positionInQueue = j;
                    break;
                }
                
                if (positionInQueue != -1)
                    `$PRINT$ A posição de ${userName} na fila é ${positionInQueue + 1}`;
                else
                {
                    foundInGroup = false;
                    for (j = 0; j < group.length; j++)
                    {
                        if (u != group[j].toLowerCase())
                            continue;
                        
                        foundInGroup = true;
                        break;
                    }
                    
                    if (foundInGroup)
                        `$PRINT$ ${userName} -> Você está no grupo atual`;
                    else
                        `$PRINT$ ${userName} -> Você não está na fila ou no grupo atual`;
                }
                break;
            default:
                `$PRINT$ ${userName} -> Esse não é um subcommand válido`;
                break;
        }
    }
    else
        `$PRINT$ Grupo atua;: ${makeListString(group)} | !fila subcommands: entrar, sair, players, tamanho, tamanhogrupo, e posição`.substr(0, 400);
}
else
    `$PRINT$ ${userName} -> As funções da fila estão desligadas`;
