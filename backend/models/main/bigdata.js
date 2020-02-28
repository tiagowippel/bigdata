'use strict';

const schema = 'bigdata';

module.exports = (sequelize, Sequelize) => {
    const Livro = sequelize.define(
        'cadLivro',
        {
            titulo: Sequelize.STRING,
            nomeArquivo: Sequelize.STRING,
        },
        {
            //tableName: 'my_very_custom_table_name'
            freezeTableName: true,
            schema,
            // indexes: [
            //     {
            //         unique: true,
            //         fields: ['titulo'],
            //     },
            // ],
        }
    );

    const Palavra = sequelize.define(
        'cadPalavra',
        {
            palavra: Sequelize.STRING,
            qtdOcorrencias: Sequelize.INTEGER,
        },
        {
            //tableName: 'my_very_custom_table_name'
            freezeTableName: true,
            schema,
            indexes: [
                {
                    unique: true,
                    fields: ['palavra'],
                },
                {
                    //unique: true,
                    fields: ['qtdOcorrencias'],
                },
            ],
        }
    );

    const LivroPalavra = sequelize.define(
        'cadLivroPalavra',
        {
            palavra: Sequelize.STRING,
            qtdOcorrencias: Sequelize.INTEGER,
            numLinhas: Sequelize.JSON, //ARRAY NO PG
        },
        {
            freezeTableName: true,
            schema,
            indexes: [
                {
                    unique: false,
                    fields: ['palavra'],
                },
            ],
        }
    );

    LivroPalavra.associate = models => {
        models.LivroPalavra.belongsTo(models.Livro, {
            foreignKey: 'idLivro',
            as: 'livro',
        });
        // models.LivroPalavras.belongsTo(models.Palavra, {
        //     foreignKey: 'idPalavra',
        //     as: 'palavra',
        // });
    };

    // const LivroPalavraPosicao = sequelize.define(
    //     'cadLivroPalavraPosicao',
    //     {
    //         palavra: Sequelize.STRING,
    //         numLinha: Sequelize.INTEGER,
    //     },
    //     {
    //         freezeTableName: true,
    //         schema,
    //     }
    // );

    // LivroPalavraPosicao.associate = models => {
    //     models.LivroPalavraPosicao.belongsTo(models.Livro, {
    //         foreignKey: 'idLivro',
    //         as: 'livro',
    //     });
    //     // models.LivroPalavraPosicao.belongsTo(models.Palavra, {
    //     //     foreignKey: 'idPalavra',
    //     //     as: 'palavra',
    //     // });
    // };

    return { Livro, LivroPalavra, Palavra }; //LivroPalavraPosicao,
};
