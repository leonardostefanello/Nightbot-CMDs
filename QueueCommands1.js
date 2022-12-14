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
                        `$PRINT$ ${userName} -> As fun????es da fila j?? est??o ativadas`;
                    else
                        addUrl + encodeURIComponent("e|") + "&print=" + encodeURIComponent("As fun????es da fila j?? est??o ativadas!");
                }
                else
                    `$PRINT$ ${userName} -> Voc?? deve ser o Streamer para desabilitar a fila`;
                break;
            case "desligar":
            case "desativar":
                if (streamerUserLevels.includes(userLevel))
                {
                    if (!enabled)
                        `$PRINT$ ${userName} -> As fun????es da fila j?? est??o desligadas`;
                    else
                        addUrl + encodeURIComponent("d|") + "&print=" + encodeURIComponent("As fun????es da fila j?? est??o desligadas!");
                }
                else
                    `$PRINT$ ${userName} -> Voc?? deve ser o Streamer para desabilitar a fila`;
                break;
            case "iniciar":
            case "come??ar":
            case "abrir":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (open)
                        `$PRINT$ ${userName} -> A fila j?? est?? aberta`;
                    else
                        addUrl + encodeURIComponent("o|") + "&print=" + encodeURIComponent("A fila j?? est?? aberta!");
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para iniciar a fila`;
                break;
            case "parar":
            case "finalizar":
            case "fechar":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (!open)
                        `$PRINT$ ${userName} -> A fila j?? est?? fechada`;
                    else
                        addUrl + encodeURIComponent("c|") + "&print=" + encodeURIComponent("Agora a fila est?? fechada!");
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para encerrar a fila`;
                break;
            case "view":
            case "mostrar":
            case "lista":
            case "todos":
                if (trustedUserLevels.includes(userLevel))
                    `$PRINT$ Grupo Atual: ${makeListString(group)} | Fila: ${makeListString(queue)}`.substr(0, 400);
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para visualizar toda a fila`;
                break;
            case "definirtamanho":
            case "mudartamanho":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (args.length == 2)
                    {
                        newSize = parseInt(args[1]);
                        if (isNaN(newSize) || newSize <= 0)
                            `$PRINT$ ${userName} -> Insira um n??mero inteiro positivo ap??s "!queue ${args[0]}"`;
                        else
                            if (size == newSize)
                                `$PRINT$ ${userName} -> O tamanho do grupo de usu??rios j?? ?? ${size}`;
                            else
                                addUrl + encodeURIComponent(`s,${newSize}|`) + "&print=" + encodeURIComponent(`The player group size was changed from ${size} to ${newSize}!`);
                    }
                    else
                        `$PRINT$ ${userName} -> Digite um novo tamanho de grupo de usu??rios ap??s "!queue ${args[0]}"`;
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para definir o tamanho do grupo de jogadores`;
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
                        `$PRINT$ ${userName} -> O n??mero de usu??rios na fila e o grupo atual (${availablePlayers}) n??o ?? alto o suficiente para gerar um novo grupo de tamanho ${size}`;
                    else
                    {
                        newPlayers = queue.length > size ? size : queue.length;
                        reusedPlayers = size - newPlayers;
                        
                        group = queue.splice(0, newPlayers).concat(group.splice(0, reusedPlayers));
                        
                        (addUrl + encodeURIComponent("g|") + "&print=" + encodeURIComponent(`New group: ${makeListString(group)}`)).substr(0, 400);
                    }
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para criar um novo grupo para a fila`;
                break;
            case "limpar":
            case "reiniciar":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (ledger == "There are no quotes added")
                        `$PRINT$ ${userName} -> A fila e o grupo atual j?? est??o vazios`;
                    else
                        clearUrl + "&print=" + encodeURIComponent("A fila e o grupo atual agora est??o vazios!");
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para limpar a fila ou o grupo atual`;
                break;
            case "adicionar":
            case "adicionarmembro":
            case "adicionarusu??rio":
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
                            `$PRINT$ ${userName} -> ${user} j?? est?? na fila na posi????o ${currentQueuePosition + 1}`;
                        else if (foundInGroup)
                            `$PRINT$ ${userName} -> ${user} j?? est?? no grupo atual`;
                        else
                            addUrl + encodeURIComponent(`j,${user}|`) + "&print=" + encodeURIComponent(`${user} foi adicionado na fila na posi????o ${queue.length + 1}`);
                    }
                    else
                        `$PRINT$ ${userName} -> Digite o usu??rio para adicionar ap??s "!queue ${args[0]}"`;
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para adicionar um usu??rio na fila`;
                break;
            case "remover":
            case "removermembro":
            case "removerusu??rio":
            case "removerseguidor":
            case "deletar":
            case "deletarmembro":
            case "deletarusu??rio":
            case "deletarseguidor":
            case "del":
            case "delmembro":
            case "delusu??rio":
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
                            addUrl + encodeURIComponent(`r,${user}|`) + "&print=" + encodeURIComponent(`${user} foi removido da fila na posi????o ${currentQueuePosition + 1}`);
                        else if (foundInGroup)
                            addUrl + encodeURIComponent(`r,${user}|`) + "&print=" + encodeURIComponent(`${user} foi removido do grupo atual` + (queue.length == 0 ? "" : ` e foi substituido por ${queue[0]}`));
                        else
                            `$PRINT$ ${userName} -> ${user} n??o est?? na fila ou grupo atual`;
                    }
                    else
                        `$PRINT$ ${userName} -> Digite um usu??rio para remover ap??s "!queue ${args[0]}"`;
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para remover um usu??rio da fila ou do grupo atual`;
                break;
            case "mover":
            case "movermembro":
            case "moverusu??rio":
            case "moverseguidor":
                if (trustedUserLevels.includes(userLevel))
                {
                    if (queue.length == 0)
                        `$PRINT$ ${userName} -> A fila est?? vazia`;
                    else if (queue.length == 1)
                        `$PRINT$ ${userName} -> Como h?? apenas 1 usu??rio na fila, ele n??o pode ser reorganizado`;
                    else
                    {
                        match = query.match(/^[^ ]+ +([^ ].*?) +([^ ]+)$/);
                        if (match)
                        {
                            user = match[1].replace(/[|,]/g, "");
                            u = user.toLowerCase();
                            position = parseInt(match[2]);
                            
                            if (isNaN(position) || position < 1 || position > queue.length)
                                `$PRINT$ ${userName} -> A posi????o precisa ser entre 1 e ${queue.length}`;
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
                                    `$PRINT$ ${userName} -> ${user} n??o est?? na fila`;
                                else if (position == currentPosition)
                                    `$PRINT$ ${userName} -> ${user} j?? est?? na fila na posi????o ${currentPosition + 1}`;
                                else
                                    addUrl + encodeURIComponent(`m,${user},${position}|`) + "&print=" + encodeURIComponent(`${user} foi movido para a posi????o ${currentPosition + 1} to ${position + 1}`);
                            }
                        }
                        else
                            `$PRINT$ ${userName} -> Digite um usu??rio para poder mover para uma nova posi????o "!queue ${args[0]}"`;
                    }
                }
                else
                    `$PRINT$ ${userName} -> Voc?? precisa de permiss??o para poder mover um usu??rio na fila`;
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
                        `$PRINT$ ${userName} -> Voc?? j?? est?? na fila na posi????o ${currentQueuePosition + 1}`;
                    else if (foundInGroup)
                        `$PRINT$ ${userName} -> Voc?? j?? est?? no grupo atual`;
                    else
                        addUrl + encodeURIComponent(`j,${user}|`) + "&print=" + encodeURIComponent(`${userName} entrou na fila na posi????o ${queue.length + 1}`);
                }
                else
                    `$PRINT$ ${userName} -> A fila est?? fechada`;
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
                        `$PRINT$ ${userName} -> Voc?? n??o est?? na fila ou no grupo atual`;
                }
                else
                    `$PRINT$ ${userName} -> A fila est?? fechada`;
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
            case "posi????o":
            case "minhaposi????o":
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
                    `$PRINT$ A posi????o de ${userName} na fila ?? ${positionInQueue + 1}`;
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
                        `$PRINT$ ${userName} -> Voc?? est?? no grupo atual`;
                    else
                        `$PRINT$ ${userName} -> Voc?? n??o est?? na fila ou no grupo atual`;
                }
                break;
            default:
                `$PRINT$ ${userName} -> Esse n??o ?? um subcommand v??lido`;
                break;
        }
    }
    else
        `$PRINT$ Grupo atua;: ${makeListString(group)} | !fila subcommands: entrar, sair, players, tamanho, tamanhogrupo, e posi????o`.substr(0, 400);
}
else
    `$PRINT$ ${userName} -> As fun????es da fila est??o desligadas`;
