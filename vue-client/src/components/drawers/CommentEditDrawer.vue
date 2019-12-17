<template>
    <a-drawer
            title="Редактировать комментарий"
            :closable="true"
            @close="onClose"
            destroyOnClose
            :visible="editCommVisible"
            wrapClassName="create-group-drawer"
    >
        <a-form :form="form" class="form" @submit="editPost">
            <div class="label"></div>
            <a-form-item>
                <a-textarea
                        placeholder="Сообщение"
                        v-decorator="['message', {
            initialValue:commentForEditing && commentForEditing.message
          }]"
                        class="secondary form-input"
                ></a-textarea>
            </a-form-item>
            <a-form-item class="create-group-button-wrapper">
                <a-spin :spinning="createButtonSpinning">
                    <a-button type="primary" html-type="submit">Сохранить</a-button>
                </a-spin>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AppInput from '../common/Input';
    import ATextarea from 'ant-design-vue/es/input/TextArea';
    import { SET_EDIT_COMMENT_VISIBLE } from '../../store/post/mutations.type';
    import { EDIT_COMMENT } from '../../store/post/actions.type';
    export default {
        name: 'AppCommentEditDrawer',
        data() {
            return {
                current: '',
                createButtonSpinning: false,
                type: 1,
                fileList: [],
                currentAttachment: true,
            };
        },
        components: {
            ATextarea,
            AppInput,
        },
        computed: {
            ...mapGetters(['user', 'commentForEditing', 'editCommVisible']),
        },
        methods: {

            onClose() {
                this.$store.commit(SET_EDIT_COMMENT_VISIBLE, false);
            },

            editPost(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, formFields) => {
                    if (!err) {
                        this.createButtonSpinning = true;
                        const comment = {
                            ...this.commentForEditing,
                            message: formFields.message,
                        };
                        this.$store.dispatch(EDIT_COMMENT, comment).finally(() => {
                            this.createButtonSpinning = false;
                            this.onClose();

                        });
                    }
                });
            },

        },
        watch: {
            commentForEditing(val) {
                this.currentAttachment = true;
            },
        },
        beforeCreate() {
            this.form = this.$form.createForm(this);
        },
    };
</script>

<style lang="scss">
    .edit-attachment-btn {
        width: 50%;
    }
    .ant-drawer {
        z-index: 9999 !important;
    }
    .create-group-drawer {
        .form {
            height: auto;
        }

        .ant-drawer-content-wrapper {
            width: 20rem !important;
            overflow: auto;
            height: 100vh;

            .ant-drawer-body {
                height: calc(100% - 3.5rem);
            }

            @media (max-width: 500px) {
                width: 100% !important;
            }
        }

        .create-group-button-wrapper {
            margin-top: 0.5rem;
            text-align: center;
        }
    }
</style>