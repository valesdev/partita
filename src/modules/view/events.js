export class ViewCreateEvent extends CustomEvent {
  constructor () {
    super('create')
  }
}

export class ViewDestroyEvent extends CustomEvent {
  constructor () {
    super('destroy')
  }
}

export class ViewShowEvent extends CustomEvent {
  constructor () {
    super('show')
  }
}

export class ViewHideEvent extends CustomEvent {
  constructor () {
    super('hide')
  }
}
