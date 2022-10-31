
const MODULE_ID = 'x-card';
const IMG_WIDTH = 420;
const IMG_HEIGHT = 600;

const modFile = rel => `modules/${MODULE_ID}/${rel}`;

class Window extends Application{
    constructor(options) {
        super(options);
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = modFile('templates/xcard.html');
        options.title = game.i18n.localize('XCard.ButtonName');
        options.id = MODULE_ID;
        options.resizable = false;
        return options;
    }

    async getData() {
        return {
            img_xcard: modFile('img/xcard.png')
        };
    }
}

async function createXCardWindow() {
    let win = new Window({ width: IMG_WIDTH, height: IMG_HEIGHT + 30 });
    win.render(true);
}

async function sendChatMessage()  {
    const messageData=  {
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        sound: modFile('sounds/card-down.wav'),
        speaker: {
            alias: game.i18n.localize("XCard.ButtonName")
        },
        content: `<p style='text-align:center'><strong>${game.i18n.localize('XCard.ChatTitle')}</strong><br>${game.i18n.localize('XCard.ChatMessage')}</p>`
    }
    await ChatMessage.create(messageData);
}

function clickHandler() {
    game.socket.emit(`module.${MODULE_ID}`);
    createXCardWindow();
    sendChatMessage();
}

Hooks.once('ready', async function () {
    game.socket.on(`module.${MODULE_ID}`, data => {
        createXCardWindow();
    });
});

Hooks.on('getSceneControlButtons', buttonsList => {
    const userMenu = buttonsList.find(element => element.name === 'token' )
    if(userMenu){
        userMenu.tools.push(
            {
                name: game.i18n.localize('XCard.ButtonName'),
                title: game.i18n.localize('XCard.ButtonTitle'),
                icon: 'far fa-file-xmark',
                button: true,
                onClick: clickHandler,
            }
        );
    }
})