<template>
    <div class='search-field'>
        <a-input-search v-model="searchText" placeholder="Поиск" @search="onSearch">
            <a-icon type="search" slot="prefix"></a-icon>
        </a-input-search>
    </div>
</template>
<style lang="scss">

    .address {
        padding: 30px;
        height: calc(100vh - 210px);
        overflow: auto;
        background-color: #f0f0f7;

        @media (max-width: 767px) {
            padding: 20px 15px;
        }

        &-header {
            display: flex;
            margin: 0;
            justify-content: space-between;
            margin-bottom: 30px;

            @media (max-width: 567px) {
                flex-wrap: wrap;
            }

            &-name {
                font-size: 24px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 32px;
                letter-spacing: normal;
                text-align: left;
                color: #43425d;

                @media (max-width: 567px) {
                    flex: 1 0 100%;
                    margin-bottom: 15px;
                }
            }

            &-search{
                @media (max-width: 567px) {
                    flex: 1 0 100%;
                }
            }

            .ant-input {
                background-color: #f0f0f7 !important;
                border-radius: 5rem;
            }
        }

        &-body {
            margin: 30px 0;
            background-color: white;
            @media (max-width: 767px) {
                width: 100%;
                overflow-x: auto;
                white-space: nowrap;
            }
        }
    }

</style>
<script>
    import { mapGetters } from 'vuex';
    import { GET_POSTS } from '../../store/post/actions.type';
    export default {
        name: 'SearchForm',
        data() {
            return {
                current: '',
                result: '',
                searchText: ''
            };
        },
        computed: {
            ...mapGetters(['posts']),
        },
        methods: {
            onSearch (value) {
                var self=this;
                this.result = self.current.filter(function(cust){ return cust.message.toLowerCase().indexOf(self.searchText.toLowerCase())>=0;});
                var tt = this.result.map(e => {
                    const row = [];
                    row.push(e.id);
                    return row;
                });
                console.log(tt);
                if(!value) {
                    this.$store.dispatch(GET_POSTS, {
                        filter: {
                            parent: {
                                type: 'company',
                                id: '0',
                            },
                        },
                    });
                }
                else {
                    this.$store.dispatch(GET_POSTS, {
                        filter: {
                            _id: tt,
                        },
                    });
                }

            }

        },
        beforeCreate() {
            this.$store.dispatch(GET_POSTS);
        },
        watch: {
            posts(posts) {
                this.data = posts.map(e => {
                    const row = {};
                    row.id = e._id;
                    row.message = e.message;
                    return row;
                });
                this.current = [...this.data];
            },
        }
    };
</script>