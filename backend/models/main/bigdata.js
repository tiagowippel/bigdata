'use strict';

const schema = 'bigdata';

module.exports = (sequelize, Sequelize) => {
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
            ],
        }
    );

    const Livro = sequelize.define(
        'cadLivro',
        {
            titulo: Sequelize.STRING,
            caminho: Sequelize.STRING,
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

    const LivroPalavras = sequelize.define(
        'cadLivroPalavras',
        {
            qtdOcorrencias: Sequelize.INTEGER,
        },
        {
            freezeTableName: true,
            schema,
        }
    );

    LivroPalavras.associate = models => {
        models.LivroPalavras.belongsTo(models.Livro, {
            foreignKey: 'idLivro',
            as: 'livro',
        });
        models.LivroPalavras.belongsTo(models.Palavra, {
            foreignKey: 'idPalavra',
            as: 'palavra',
        });
    };

    const LivroPalavraPosicao = sequelize.define(
        'cadLivroPalavraPosicao',
        {
            numLinha: Sequelize.INTEGER,
        },
        {
            freezeTableName: true,
            schema,
        }
    );

    LivroPalavraPosicao.associate = models => {
        models.LivroPalavraPosicao.belongsTo(models.Livro, {
            foreignKey: 'idLivro',
            as: 'livro',
        });
        models.LivroPalavraPosicao.belongsTo(models.Palavra, {
            foreignKey: 'idPalavra',
            as: 'palavra',
        });
    };

    return { Livro, LivroPalavras, LivroPalavraPosicao, Palavra };
};
