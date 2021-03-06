require 'rails_helper'

RSpec.describe Pref, type: :model do

  context "attributes" do

    it { is_expected.to serialize(:settings) }

  end

  context "associations" do

    it { is_expected.to belong_to(:user) }

  end

  context "validations" do
    it { is_expected.to validate_presence_of(:user) }
    it { is_expected.to validate_presence_of(:settings) }
  end

  describe ".default_settings" do

    it "returns Rails configuration for preferences" do
      expect(Pref.default_settings).to eql(Rails.configuration.branding[:preferences])
      expect(Pref.default_settings).not_to be_nil
    end

  end

end
