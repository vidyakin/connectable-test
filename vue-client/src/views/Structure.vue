<template>
  <div class="structure">
    <app-create-project :visible="createVisible" :close="closeCreate"/>
    <div class="structure-header">
      <div class="structure-header-name">
        Структура
      </div>
      <div class="structure-header-search">
        <a-button type="primary" v-if="test">Редактировать</a-button>
        <a-button type="primary" v-else="!test" @click="openCreate">Создать проект</a-button>
      </div>
    </div>

    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="Структура" key="1">
        <div class="c-structure">

          <div class="c-structure__head">
            <div class="c-structure__link">Главная</div>
          </div>

          <div class="c-structure__row">

            <div class="c-structure__item">

              <div class="c-structure__article">
                <div class="c-structure__link">Раздел 1</div>
              </div>

              <div class="c-structure__child__row">

                <div class="c-structure__child__item">

                  <div class="c-structure__child__article">
                    <div class="c-structure__link">Подраздел 1</div>
                  </div>

                  <div class="c-structure__detail__row">

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 1</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 2</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 3</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="c-structure__child__item">

                  <div class="c-structure__child__article">
                    <div class="c-structure__link">Подраздел 2</div>
                  </div>

                  <div class="c-structure__detail__row">

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 1</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 2</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="c-structure__item">

              <div class="c-structure__article">
                <div class="c-structure__link">Раздел 2</div>
              </div>

              <div class="c-structure__child__row">

                <div class="c-structure__child__item">

                  <div class="c-structure__child__article">
                    <div class="c-structure__link">Подраздел 1</div>
                  </div>

                  <div class="c-structure__detail__row">

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 1</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 2</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 3</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="c-structure__child__item">

                  <div class="c-structure__child__article">
                    <div class="c-structure__link">Подраздел 2</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="c-structure__item">

              <div class="c-structure__article">
                <div class="c-structure__link">Раздел 3</div>
              </div>

              <div class="c-structure__child__row">

                <div class="c-structure__child__item">

                  <div class="c-structure__child__article">
                    <div class="c-structure__link">Подраздел 1</div>
                  </div>

                  <div class="c-structure__detail__row">

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 1</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="c-structure__child__item">

                  <div class="c-structure__child__article">
                    <div class="c-structure__link">Подраздел 2</div>
                  </div>

                  <div class="c-structure__detail__row">

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 1</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 2</div>
                      </div>
                    </div>

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <div class="c-structure__link">Статья 3</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <!--<AppDepantaments />-->
      </a-tab-pane>
      <a-tab-pane tab="Проекты" key="2">
        <app-projects/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>

  import AppCreateProject from '../components/drawers/CreateProject';
  import {mapGetters} from 'vuex';
  import {GET_GROUPS} from '../store/group/actions.type';
  import AppProjects from '../views/Projects';
  import AppDepantaments from '../components/common/Departaments';

  export default {
    components: {
      AppCreateProject,
      AppProjects,
      AppDepantaments,
    },
    data() {
      return {
        createVisible: false,
        test: true,
      };
    },
    methods: {
      callback(key) {
        if (key === '2') {
          this.test = false;
        } else if (key === '1') {
          this.test = true;
        }
      },
      closeCreate() {
        this.createVisible = false;
      },
      openCreate() {
        this.createVisible = true;
      },
    },
    beforeCreate() {
      this.$store.dispatch(GET_GROUPS);
    },
    computed: {
      ...mapGetters(['groups']),
    },
  };
</script>

<style lang="scss">

  .is-hide-img-header{
    .structure {
      height: calc(100vh - 50px);
    }
  }
  .ant-tabs-tabpane {
    overflow: auto;
  }
  .structure {
    padding: 30px;

    height: calc(100vh - 210px);
    overflow: auto;
    background-color: #f0f0f7;

    @media (max-width: 767px) {
      padding: 20px 15px;
    }

    &-header {
      display: flex;
      margin: 0 0 30px;
      justify-content: space-between;

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
    }

    .ant-tabs {
      background-color: white;
      margin: 30px 0;

      .ant-tabs-nav-scroll {
        text-align: left;
      }
    }
  }

  .c-structure{
    min-width: 980px;
    overflow-x: visible;
  }

  .c-structure__head{
    margin-bottom: 20px;

    .c-structure__link{
      min-width: 200px;
      color: #000000;
      background-color: #d4d6dc;
    }
  }

      .c-structure__row{
        position: relative;
        display: block;
        width: 100%;
        font-size: 0;

        &:before{
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          margin-left: -1px;
          width: 2px;
          height: 20px;
          border: 1px solid #949494;
        }
      }

        .c-structure__item{
          width: 33.33%;
          position: relative;
          padding: 20px 15px;
          display: inline-block;
          vertical-align: top;
          text-align: center;

          &:first-child{
            &:before{
              content: none;
            }
          }

          &:before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            margin-left: -50%;
            width: 100%;
            border: 1px solid #949494;
          }
        }

          .c-structure__article{
            position: relative;
            display: block;
            margin-bottom: 40px;

            &:before{
              content: '';
              position: absolute;
              top: -20px;
              left: 50%;
              margin-left: -1px;
              width: 2px;
              height: 100%;
              border: 1px solid #949494;
            }

            .c-structure__link{
              min-width: 200px;
            }
          }

            .c-structure__link{
              position: relative;
              display: inline-block;
              max-width: 100%;
              padding: 15px 15px;
              font-size: 16px;
              line-height: 1.5;
              font-weight: 700;
              color: #949494;
              box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
              background-color: #ffffff;
              cursor: pointer;
              z-index: 1;
              transition: .3s ease;

              &:hover{
                color: #3b86ff;
                box-shadow: none;
              }
            }

        .c-structure__child__row{
          position: relative;
          display: block;
          width: 100%;
          font-size: 0;

          &:before{
            content: '';
            position: absolute;
            top: -60px;
            left: 50%;
            margin-left: -1px;
            width: 2px;
            height: 40px;
            border: 1px solid #949494;
          }
        }

          .c-structure__child__item{
            width: 50%;
            position: relative;
            padding: 0 5px;
            display: inline-block;
            vertical-align: top;

            &:first-child{
              &:before{
                content: none;
              }
            }

            &:before{
              content: '';
              position: absolute;
              top: -20px;
              left: 0;
              margin-left: -50%;
              width: 100%;
              border: 1px solid #949494;
            }
          }

            .c-structure__child__article{
              position: relative;
              display: block;
              margin-bottom: 40px;

              &:before{
                content: '';
                position: absolute;
                top: -20px;
                left: 50%;
                margin-left: -1px;
                width: 2px;
                height: 100%;
                border: 1px solid #949494;
              }

              .c-structure__link{
                display: block;
              }
            }

              .c-structure__detail__row{
                position: relative;
                padding-left: 20px;

                &:before{
                  content: '';
                  position: absolute;
                  top: -60px;
                  left: 10px;
                  width: 1px;
                  bottom: 26px;
                  border: 1px solid #949494;
                }
              }

                .c-structure__detail__item{
                  position: relative;
                  margin-bottom: 15px;

                  &:before{
                    content: '';
                    position: absolute;
                    margin-top: -1px;
                    left: -10px;
                    bottom: 26px;
                    width: 100%;
                    border: 1px solid #949494;
                  }
                }

                  .c-structure__detail__article{

                    .c-structure__link{
                      display: block;
                      background-color: #007bff;
                      color: #ffffff;
                    }
                  }

</style>