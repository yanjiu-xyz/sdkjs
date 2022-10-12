const mockEditor = AscTest.Editor;

mockEditor.pre_Paste = function (first, second, callback) {
    callback();
}

window['AscCommonWord']['CDocumentComparison'].prototype.setReviewInfo = function(oReviewInfo, sCustomReviewUserName, nCustomReviewDate)
{
    oReviewInfo.Editor   = this.api;
    oReviewInfo.UserId   = "";
    oReviewInfo.MoveType = Asc.c_oAscRevisionsMove.NoMove;
    oReviewInfo.PrevType = -1;
    oReviewInfo.PrevInfo = null;
    oReviewInfo.UserName = sCustomReviewUserName || "Valdemar";
    oReviewInfo.DateTime = 3000000;
    if (AscFormat.isRealNumber(nCustomReviewDate)) {
        oReviewInfo.DateTime = nCustomReviewDate;
    }
};

function readMainDocument(mainDocumentInfo) {
    const document = new AscWord.CDocument(mockEditor.WordControl.m_oDrawingDocument, true);
    mockEditor.WordControl.m_oDrawingDocument.m_oLogicDocument = document;
    mockEditor.WordControl.m_oLogicDocument = document;
    document.Api = mockEditor;
    createTestDocument(document, mainDocumentInfo);
    return document
}

function readRevisedDocument(mainDocumentInfo) {
    const oDoc1 = mockEditor.WordControl.m_oLogicDocument;
    let oDoc2 = new CDocument(mockEditor.WordControl.m_oDrawingDocument, true);
    mockEditor.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc2;
    mockEditor.WordControl.m_oLogicDocument = oDoc2;

    createTestDocument(oDoc2, mainDocumentInfo);
    
    mockEditor.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc1;
    mockEditor.WordControl.m_oLogicDocument = oDoc1;
    if (oDoc1.History)
        oDoc1.History.Set_LogicDocument(oDoc1);
    if (oDoc1.CollaborativeEditing)
        oDoc1.CollaborativeEditing.m_oLogicDocument = oDoc1;
    return oDoc2;
}

function createTestDocument(document, paragraphsTextInfo) {

    for (let i = 0; i < paragraphsTextInfo.length; i += 1) {
        const paragraphTextInfo = paragraphsTextInfo[i];
        let paragraph;
        if (i === 0) {
            paragraph = document.Content[0];
        } else {
            paragraph = AscTest.CreateParagraph();
        }
        
        for (let j = 0; j < paragraphTextInfo.length; j += 1) {
            const paraRun = new AscWord.ParaRun();
            if (paragraphTextInfo[j].text) {
                paraRun.AddText(paragraphTextInfo[j].text);
                paraRun.SetReviewTypeWithInfo(paragraphTextInfo[j].reviewType, paragraphTextInfo[j].reviewInfo);
                paragraph.AddToContentToEnd(paraRun);
            } else {
                paragraph.GetParaEndRun().SetReviewTypeWithInfo(paragraphTextInfo[j].reviewType, paragraphTextInfo[j].reviewInfo, false);
            }
        }
        if (i !== 0) {
            document.AddToContent(document.Content.length, paragraph);
        }
    }
    return document;
}

function createParagraphInfo(sText, mainReviewInfoOpts, additionalReviewInfoOpts) {
    const oRet = {
        text: sText,
        reviewType: reviewtype_Common
    };
    let mainReviewInfo;
    if (mainReviewInfoOpts) {
        mainReviewInfo = createReviewInfoFromOptions(mainReviewInfoOpts);
        oRet.reviewType = mainReviewInfoOpts.reviewType;
        if (additionalReviewInfoOpts) {
            const additionalReviewInfo = createReviewInfoFromOptions(additionalReviewInfoOpts);
            additionalReviewInfo.SavePrev(additionalReviewInfoOpts.reviewType);
            mainReviewInfo.PrevType = additionalReviewInfo.PrevType;
            mainReviewInfo.PrevInfo = additionalReviewInfo.PrevInfo;
        }
    } else {
        mainReviewInfo = createReviewInfoFromOptions();
    }
    oRet.reviewInfo = mainReviewInfo;
    return oRet;
}

function createShapeInfo() {
    
}

function createReviewInfoFromOptions(opts) {
    opts = opts || {};
    const oReviewInfo = new CReviewInfo();

    oReviewInfo.Editor = mockEditor;
    oReviewInfo.UserId   = "";
    oReviewInfo.MoveType = Asc.c_oAscRevisionsMove.NoMove;
    oReviewInfo.PrevType = -1;
    oReviewInfo.PrevInfo = null;
    oReviewInfo.UserName = opts.userName || oReviewInfo.UserName;
    oReviewInfo.DateTime = opts.dateTime || oReviewInfo.DateTime;

    return oReviewInfo;
}

const testObjectInfo = [
    ///////////////////////// -> 1 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo(''),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет')
            ]
        ]
    },
    ///////////////////////// -> 2 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo(''),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('')
            ]
        ]
    },
    ///////////////////////// -> 3 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Приветище')
            ]
        ]
    },
    ///////////////////////// -> 4 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000})
            ]
        ]
    },
    ///////////////////////// -> 5 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Приветище', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000})
            ]
        ]
    },
    ///////////////////////// -> 6 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет, как дела?'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('При', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('вет, как дела?')
            ]
        ]
    },
    ///////////////////////// -> 7 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет Привет Привет'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет'), createParagraphInfo(' Привет', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' Привет')
            ]
        ]
    },
    ///////////////////////// -> 8 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет'), createParagraphInfo(' ой', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' Привет'), createParagraphInfo(' Привет'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет'), createParagraphInfo(' Привет', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' Привет')
            ]
        ]
    },
    ///////////////////////// -> 9 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('как дела?')
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет, ', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('как дела?')
            ]
        ]
    },
    ///////////////////////// -> 10 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет, как дела?')
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Приветик, ', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('как дела?')
            ]
        ]
    },
    ///////////////////////// -> 11 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет, как дела?'), createParagraphInfo(' Нормально, а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000})
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет, как дела?'), createParagraphInfo(' Хорошо, а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 2000000})
            ]
        ]
    },
    ///////////////////////// -> 12 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет, как дела? Нормально, а у тебя как?')
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет, как дела?'), createParagraphInfo(' Хорошо, а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000})
            ]
        ]
    },
    ///////////////////////// -> 13 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет, как дела?   Хорошо, а у тебя как?')
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет, как дела?    '), createParagraphInfo(' Нормально, а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000})
            ]
        ]
    },
    ///////////////////////// -> 14 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('При', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('вет, как д'),createParagraphInfo('ел', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}),createParagraphInfo('а?'),
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Пр'),createParagraphInfo('и', {reviewType: reviewtype_Remove, userName: 'John Smoth', dateTime: 2000000}),createParagraphInfo('в'),createParagraphInfo('е', {reviewType: reviewtype_Add, userName: 'John Smoth', dateTime: 2000000}),createParagraphInfo('т'),createParagraphInfo(',', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}),createParagraphInfo(' к'),createParagraphInfo('а', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}),createParagraphInfo('к', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}),createParagraphInfo(' '),createParagraphInfo('д', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}),createParagraphInfo('ела?'),
            ]
        ]
    },
    ///////////////////////// -> 15 <- /////////////////////////////
    {
        originalDocument: [
            [
                createParagraphInfo('Привет, как уюю у '), createParagraphInfo('тебя', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' дела    ', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' дела?')
            ]
        ],
        revisedDocument: [
            [
                createParagraphInfo('Привет,'), createParagraphInfo(' ну ты даешь,', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' как у '), createParagraphInfo(' опо', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' дела?')
            ]
        ]
    },

];
const answers = [
  /////////////////////////////////// -> 1 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [createParagraphInfo(undefined, {reviewType: reviewtype_Remove, userName: 'Valdemar', dateTime: 3000000})],
            [
                createParagraphInfo('Привет', {reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000})
            ]
        ]
    },
    /////////////////////////////////// -> 2 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [createParagraphInfo()],
        ]
    },
    /////////////////////////////////// -> 3 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [createParagraphInfo('Привет', {reviewType: reviewtype_Remove, userName: 'Valdemar', dateTime: 3000000}), createParagraphInfo(undefined, {reviewType: reviewtype_Remove, userName: 'Valdemar', dateTime: 3000000})],
          [createParagraphInfo('Приветище', {reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000}), createParagraphInfo(undefined)]
        ]
    },
    /////////////////////////////////// -> 4 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [createParagraphInfo('Привет', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(undefined)]
        ]
    },
    /////////////////////////////////// -> 5 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [createParagraphInfo('Привет', {reviewType: reviewtype_Remove, userName: 'Valdemar', dateTime: 3000000}), createParagraphInfo(undefined, {reviewType: reviewtype_Remove, userName: 'Valdemar', dateTime: 3000000})],
            [createParagraphInfo('Приветище', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(undefined)]
        ]
    },
    /////////////////////////////////// -> 6 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [createParagraphInfo('При', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('вет, как дела?')],
        ]
    },
    /////////////////////////////////// -> 7 <- ////////////////////////////////////////////
    {
        finalDocument: [
          [createParagraphInfo('Привет'), createParagraphInfo(' Привет', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' Привет')]
        ]
    },
    /////////////////////////////////// -> 8 <- ////////////////////////////////////////////
    {
        finalDocument: [
          [
            createParagraphInfo('Привет'), createParagraphInfo(' ой', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}),createParagraphInfo(' ', {reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000}),createParagraphInfo('Привет', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' Привет')
          ]
        ]
    },
    /////////////////////////////////// -> 9 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
              createParagraphInfo('Привет, ', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('как дела?')
            ]
        ]
    },
    /////////////////////////////////// -> 10 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
              createParagraphInfo('Привет',{reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000}),createParagraphInfo('Приветик, ',{reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('как дела?')
            ]
        ]
    },
    /////////////////////////////////// -> 11 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
              createParagraphInfo('Привет, как дела?'), createParagraphInfo(' Нормально',{reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('Хорошо', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 2000000}),createParagraphInfo(', а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}),
            ]
        ]
    },
    /////////////////////////////////// -> 12 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
                createParagraphInfo('Привет, как дела?'), createParagraphInfo(' ',{reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('Нормально', {reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000}), createParagraphInfo('Хорошо, а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000})
            ]
        ]
    },
    /////////////////////////////////// -> 13 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
                createParagraphInfo('Привет, как дела?   '), createParagraphInfo('Хорошо', {reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000}), createParagraphInfo('  Нормально, а у тебя как?', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}),
            ]
        ]
    },
    /////////////////////////////////// -> 14 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
                createParagraphInfo('Пр', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('и', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}, {reviewType: reviewtype_Add, userName: 'John Smoth', dateTime: 2000000}), createParagraphInfo('в'), createParagraphInfo('е', {reviewType: reviewtype_Add, userName: 'John Smoth', dateTime: 2000000}), createParagraphInfo('т'), createParagraphInfo(',', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' к'), createParagraphInfo('а', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('к', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' '), createParagraphInfo('д', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('ел', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo('а?')
            ]
        ]
    },
    /////////////////////////////////// -> 15 <- ////////////////////////////////////////////
    {
        finalDocument: [
            [
              createParagraphInfo('Привет,'),createParagraphInfo(' ну ты даешь,', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' как'), createParagraphInfo(' уюю', {reviewType: reviewtype_Add, userName: 'Valdemar', dateTime: 3000000}),createParagraphInfo(' у '), createParagraphInfo('тебя', {reviewType: reviewtype_Remove, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' дела     опо', {reviewType: reviewtype_Add, userName: 'John Smith', dateTime: 1000000}), createParagraphInfo(' дела?')
            ]
        ]
    },
];

const comments = [];