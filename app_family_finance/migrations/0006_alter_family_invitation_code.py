# Generated by Django 5.0.6 on 2024-06-10 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_family_finance', '0005_family_invitation_code_alter_family_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='family',
            name='invitation_code',
            field=models.CharField(max_length=10, unique=True),
        ),
    ]
