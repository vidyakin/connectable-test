<template>
  <div class="setting">
    <div class="setting-name">Настройки нотификаций</div>
    <div class="content-wrap">
      <ul>
        <li>
          <label for="addUser">
            <input type="checkbox" id="addUser" name="addUser" />
            При добавлении юзера
          </label>
        </li>
        <li>
          <label for="publications">
            <input type="checkbox" id="publications" name="publications" />
            При публикации в разделе компания, в группах, в которых состоит юзер, у
            пользователей, на которых он подписан
          </label>
        </li>
        <li>
          <label for="eventComment">
            <input type="checkbox" id="eventComment" name="eventComment" />
            во всех публикациях и комментариях, где юзера тегнули через @
          </label>
        </li>
        <li>
          <label for="eventCalendar">
            <input type="checkbox" id="eventCalendar" name="eventCalendar" />
            при добавлении события в Календарь
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
  .is-hide-img-header{
    .setting {
      height: calc(100vh - 50px);
    }
  }
  .setting {
    padding: 30px;
    background-color: #f0f0f7;
    height: calc(100vh - 210px);
    overflow: auto;

    @media (max-width: 767px) {
      padding: 20px 15px;
    }
    &-name {
      font-size: 1.5rem;
      line-height: 32px;
      color: #43425d;
      text-align: left;
      margin-bottom: 30px;
    }
    .row {
      background: none;
    }
    .content-wrap {
      text-align: left;

      ul {
        list-style: none;
        padding: 0 0 0;
      }

    }
  }

</style>
