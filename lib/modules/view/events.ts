export class ViewCreateEvent extends CustomEvent<void> {
  constructor () {
    super('create')
  }
}

export class ViewDestroyEvent extends CustomEvent<void> {
  constructor () {
    super('destroy')
  }
}

export class ViewShowEvent extends CustomEvent<void> {
  constructor () {
    super('show')
  }
}

export class ViewHideEvent extends CustomEvent<void> {
  constructor () {
    super('hide')
  }
}
