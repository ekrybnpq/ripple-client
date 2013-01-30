var util      = require('util');
var webutil   = require('../util/web');
var Tab       = require('../client/tabmanager').Tab;
var id        = require('../client/id').Id.singleton;

var ContactsTab = function ()
{
  Tab.call(this);
};

util.inherits(ContactsTab, Tab);

ContactsTab.prototype.parent = 'wallet';

ContactsTab.prototype.generateHtml = function ()
{
  return require('../../jade/tabs/contacts.jade')();
};

ContactsTab.prototype.angular = function (module) {
  var app = this.app;
  var tm = this.tm;

  module.controller('ContactsCtrl', ['$scope', function ($scope)
  {
    $scope.reset_form = function ()
    {
      $scope.contact = {
        name: '',
        address: ''
      };
      if ($scope.addForm) $scope.addForm.$setPristine();
    };

    $scope.reset_form();

    /**
     * Toggle "add contact" form
     */
    $scope.toggle_form = function ()
    {
      $scope.addform_visible = !$scope.addform_visible;
      $scope.reset_form();

      // Focus on first input
      setImmediate(function() {
        $('#addForm').find('input:first').focus();
      });
    };

    /**
     * Create contact
     */
    $scope.create = function ()
    {
      var contact = {
        name: $scope.contact.name,
        address: $scope.contact.address,
        // Used for animation
        justAdded: true
      };

      // Enable the animation
      $scope.enable_highlight = true;

      // Add an element
      $scope.userBlob.data.contacts.unshift(contact);

      // Hide the form
      $scope.toggle_form();

      // Clear form
      $scope.reset_form();
    };
  }]);

  module.controller('ContactRowCtrl', ['$scope', function ($scope) {
    $scope.editing = false;

    /**
     * Switch to edit mode
     *
     * @param index
     */
    $scope.edit = function (index)
    {
      $scope.editing = true;
      $scope.editname = $scope.entry.name;
      $scope.editaddress = $scope.entry.address;
    };

    /**
     * Update contact
     *
     * @param index
     */
    $scope.update = function (index)
    {
      if (!$scope.inlineAddress.editaddress.$error.rpUnique
          && !$scope.inlineAddress.editaddress.$error.rpAddress
          && !$scope.inlineName.editname.$error.rpUnique) {
        // Update blob
        $scope.entry.name = $scope.editname;
        $scope.entry.address = $scope.editaddress;
        $scope.editing = false;
      }
    };

    /**
     * Remove contact
     *
     * @param index
     */
    $scope.remove = function (index) {
      // Update blob
      $scope.userBlob.data.contacts.splice(index,1);
    };

    /**
     * Cancel contact edit
     *
     * @param index
     */
    $scope.cancel = function (index)
    {
      $scope.editing = false;
    };

    $scope.send = function (index)
    {
      app.tabs.message('send', 'prefill', {
        recipient: $scope.entry.name
      });

      setImmediate(function () {
        app.tabs.gotoTab('send');
      });
    };
  }]);
};

module.exports = ContactsTab;
