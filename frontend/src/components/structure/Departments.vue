<template>
    <div class='departments'>
        <vo-basic
            :data='chartData'
            :zoom='true'
            :pan='true'
            :toggleCollapse='false'
            :toggleSiblingsResp='true'
            :createNode='createdNode'
            @nodeClick='nclick'
        >
        </vo-basic>
        <vue-context ref='menu'>
            <li class='menu-item'>
            <a @click.prevent='onClick(1)'>
                <div class='title'>Иван Иванов</div>
                <div class='subtitle'>Начальник подразделения</div>
            </a>
            </li>
            <li class='menu-item'>
            <a @click.prevent='onClick(2)'>
                <div class='title'>Петр Васильев</div>
                <div class='subtitle'>Менеджер по продажам</div>
            </a>
            </li>
            <li class='menu-item'>
            <a @click.prevent='onClick(3)'>
                <div class='title'>Наталья Нетопырева</div>
                <div class='subtitle'>Бухгалтер</div>
            </a>
            </li>
        </vue-context>
    </div>  
</template>

<script>

import { VoBasic } from 'vue-orgchart'; 
import { VueContext } from 'vue-context';
import "vue-context/src/sass/vue-context.scss";

export default {
    name: 'Departments',
    components: {
        VoBasic,
        VueContext
    },
    data() {
        return {
            labels: ['CEO-1', 'CEO-2', 'CEO-3', 'CEO-4'],
            chartData: {
                id: 'ceo1',
                name: 'CEO',
                children: [
                {
                    id: 'depm',
                    name: 'Департамент маркетинга',
                    children: [
                    { id: 'offlm', name: 'Отдел оффлайн маркетинга' },
                    {
                        id: 'onlm',
                        name: 'Отдел онлайн маркетинга',
                        children: [
                        { id: 'rrc', name: 'Группа PPC' },
                        { id: 'seo', name: 'Группа SEO' },
                        { id: 'fb', name: 'Группа Facebook' }
                        ]
                    }
                    ]
                },
                {
                    id: 'hr',
                    name: 'Департамент HR',
                    children: [{ name: 'Preact' }]
                },
                {
                    id: 'it',
                    name: 'Департамент IT',
                    children: [{ name: 'Moon' }]
                }
                ]
            }
        }
    },
    mounted() {
        let cc = document.getElementById('chart-container');
        if (!cc) return;
        this.labels.map((l, i) => {
        let num = i + 1;
        const labelDiv = document.createElement('div');
        labelDiv.id = 'label' + num;
        labelDiv.innerText = 'CEO-' + num;
        labelDiv.classList.add('label', 'label-' + num);
        cc.firstChild.append(labelDiv);
        });
    },
    methods: {
        contextClick(e) {
            e.preventDefault();
            this.$refs.menu.open(e, e.currentTarget.id);
        },
        onClick(data) {
            console.log(data);
            // alert('Clicked for ' + e.currentTarget.id);
        },
        nclick(e) {
            const id = e.toElement.parentNode.id;
            const pos = { x: e.pageX, y: e.pageY };
            console.log(`CLICKed on id: ${id}, at ${pos.x}:${pos.y}`);
        },
        hide() {
            console.log(111);
            this.visible = false;
        },
        // eslint-disable-next-line no-unused-vars
        createdNode(n, d) {
            n.oncontextmenu = this.contextClick;
        }
    }
}
</script>

<style>

.orgchart {
  background-size: 51px !important;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAADSCAIAAACHGQRkAAAA20lEQVR42u3RsQnCUAAA0fzsP6JgIw6gkKBFopYB+1zxboIHN5blPfUaWFhYgbCwsAphYWEVwsLCKoSFhVUICwurEBYWViEsLKxCWFhYhbCwsAphYWEVwsLCKoSFhVUICwurEBYWViEsLKxCWFhYhaqsx/M1xtmKY/s+jet93bb9bMmheR7jclv3lmr63vuxzmb8k2FhYQXCwsIqhIWFVQgLC6sQFhZWISwsrEJYWFiFsLCwCmFhYRXCwsIqhIWFVQgLC6sQFhZWISwsrEJYWFiFsLCwCmFhYRX6ACZTVVNncImeAAAAAElFTkSuQmCC');
}
.orgchart .node {
  display: inline-table !important;
  margin: 0 20px !important;
  width: 200px !important;
  border: 1px solid lightsteelblue;
  border-radius: 4px;
  cursor: default;
}

.orgchart .node .title {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background-color: white !important;
  border-radius: 4px !important;
  width: 200px !important;
  height: 55px !important;
  font-family: 'Source Sans Pro';
  font-size: 16px !important;
  font-weight: bold !important;
  color: #949494 !important;
  white-space: pre-line !important;
  padding: 5px;
}
.orgchart tr.lines .rightLine,
.orgchart tr.lines .leftLine {
  width: 100px !important;
}

#chart-container {
  height: 520px !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
}

.label {
  position: absolute;
  left: 10px;
  font-size: 12pt;
  font-weight: bold;
  color: darkgray;
}

.label-1 {
  top: 6px;
}
.label-2 {
  top: 113px;
}
.label-3 {
  top: 220px;
}
.label-4 {
  top: 327px;
}
.label-5 {
  top: 434px;
}


/* настраиваем меню */
.menu-item .title {
  font-weight: bold;
  font-size: 12pt;
}
.menu-item .subtitle {
  font-size: 11pt;
}
</style>